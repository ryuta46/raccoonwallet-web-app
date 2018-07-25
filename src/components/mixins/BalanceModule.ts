import Vue from 'vue';
import {createMosaicTransferableFrom} from "../../lib/mosaicUtils";
import {WalletsHelper} from "../../lib/storage";
import {getAccountHttp, getMosaicHttp} from "../../lib/nisUtils";
import {Address, MosaicTransferable, XEM} from "nem-library";
import {getDivided} from "../../lib/numberUtils";

type BalanceFetched = (balance: number, mosaics: MosaicTransferable[]) => void;
type BalanceError = (error: Error) => void;

const mosaicDescriptionsDefault: { [key: string]: string} = {};

declare module 'vue/types/vue' {
  interface Vue {
    balance: number,
    ownedMosaics: MosaicTransferable[],
    mosaicDescriptions: {[key:string]: string},
    fetchBalance: (withMosaics?: boolean, balance?: BalanceFetched, error?: BalanceError) => void
  }
}

export default Vue.extend({
  data () {
    return {
      balance: 0,
      ownedMosaics: <MosaicTransferable[]>[],
      mosaicDescriptions: Object.assign({}, mosaicDescriptionsDefault)
    }
  },
  methods: {
    async fetchBalance(withMosaics: boolean = false, onFetched: BalanceFetched = () => {}, onError: BalanceError = () => {}) {
      const activeWallet = await WalletsHelper.getActive();
      if (activeWallet == null) {
        return
      }
      const accountHttp = getAccountHttp();
      const address = new Address(activeWallet.address);

      accountHttp.getMosaicOwnedByAddress(address).subscribe(
        mosaics => {
          this.ownedMosaics = [];
          const mosaicHttp = getMosaicHttp();
          const mosaicCount = mosaics.length;
          for(let mosaic of mosaics) {
            if (mosaic.mosaicId.name === "xem" && mosaic.mosaicId.namespaceId === "nem") {
              const amount = getDivided( mosaic.quantity, 6).toNumber();
              this.balance = amount;
              const xem = new XEM(amount);
              this.ownedMosaics.push(xem);
              this.mosaicDescriptions[xem.mosaicId.description()] = '';
            } else {
              if (withMosaics) {
                mosaicHttp.getMosaicDefinition(mosaic.mosaicId).subscribe(
                  mosaicDefinition => {
                    const mosaicTransferable = createMosaicTransferableFrom(mosaicDefinition, mosaic.quantity);
                    this.ownedMosaics.push(mosaicTransferable);
                    this.ownedMosaics = this.ownedMosaics.sort((left: MosaicTransferable, right: MosaicTransferable) => {
                      return left.mosaicId.description().localeCompare(right.mosaicId.description());
                    });

                    this.mosaicDescriptions[mosaicTransferable.mosaicId.description()] = mosaicDefinition.description;

                    if (this.ownedMosaics.length === mosaicCount) {
                      onFetched(this.balance, this.ownedMosaics);
                    }
                  },
                  error => {
                    this.balance = 0;
                    this.ownedMosaics = [];
                    this.mosaicDescriptions = Object.assign({}, mosaicDescriptionsDefault);
                    onError(error);
                  }
                );
              }
            }
          }
          if (!withMosaics || this.ownedMosaics.length === mosaicCount) {
            onFetched(this.balance, this.ownedMosaics);
          }
        },
        error => {
          this.balance = 0;
          this.ownedMosaics = [];
          onError(error);
        }
      );
    }
  },
});
