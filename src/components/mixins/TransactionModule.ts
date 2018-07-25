import Vue from 'vue'
import {TransactionWrapper} from "../../lib/transactionWrapper";
import {getAccountHttp} from "../../lib/nisUtils";
import {WalletsHelper} from "../../lib/storage";
import {Address} from "nem-library";

type TransactionFetched = (confirmedTransaction: TransactionWrapper[], unconfirmedTransactions: TransactionWrapper[]) => void;
type TransactionError = (error: Error) => void;

declare module 'vue/types/vue' {
  interface Vue {
    confirmedTransactions: TransactionWrapper[] | null,
    unconfirmedTransactions: TransactionWrapper[] | null,
    fetchTransactions: (pageSize?: number, withUnconfirmedTransactions?: boolean, onFetched?: TransactionFetched, onError?: TransactionError) => void
  }
}


export default Vue.extend({
  data () {
    return {
      confirmedTransactions: <TransactionWrapper[] | null>[],
      unconfirmedTransactions: <TransactionWrapper[] | null>[],
    }
  },
  methods: {
    async fetchTransactions(count: number = 10, withUnconfirmedTransactions: boolean = false, onFetched: TransactionFetched = () => {}, onError: TransactionError = () => {}) {
      const activeWallet = await WalletsHelper.getActive();
      if (activeWallet == null) {
        return
      }

      this.confirmedTransactions = null;
      this.unconfirmedTransactions = null;

      const accountHttp = getAccountHttp();
      const address = new Address(activeWallet.address);

      accountHttp.allTransactions(address, {pageSize: count}).subscribe(
        transactions => {
          this.confirmedTransactions = transactions
            .map(transaction => TransactionWrapper.fromTransaction(transaction, address))
            .filter(info => info != null) as TransactionWrapper[];

          if (!withUnconfirmedTransactions || this.unconfirmedTransactions != null) {
            onFetched(this.confirmedTransactions, this.unconfirmedTransactions || []);
          }
        },
        error => {
          onError(error);
        }
      );

      if (withUnconfirmedTransactions) {
        accountHttp.unconfirmedTransactions(address).subscribe(
          transactions => {
            this.unconfirmedTransactions = transactions
              .map(transaction => TransactionWrapper.fromTransaction(transaction, address))
              .filter(info => info != null) as TransactionWrapper[];

            if (this.confirmedTransactions != null) {
              onFetched(this.confirmedTransactions, this.unconfirmedTransactions);
            }
          },
          error => {
            onError(error);
          }
        )
      }
    },
  },
});
