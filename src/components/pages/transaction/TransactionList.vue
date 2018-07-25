<template>
  <div>
    <tool-bar back="/top?tab=home" :title="$t('transaction.list_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_transaction_small.png">

        <div v-if="loadingTransaction" style="margin-top: 24px; display: flex; justify-content: center; align-items: center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else-if="Object.keys(transactions).length === 0" style="margin-top: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img src="../../../assets/image_empty1_large.png" width="50%">
          <span class="app-large-text app-secondary-text">{{$t('transaction.no_transaction_title')}}</span>
          <span class="app-secondary-text" v-for="sentence in $t('transaction.no_transaction_message')">{{ sentence }}<br></span>
        </div>
        <template v-else v-for="dateKey in Object.keys(transactions).slice().reverse()">
          <v-divider></v-divider>
          <p style="margin-top: 8px">{{transactions[dateKey][0].dateString}}</p>
          <v-divider></v-divider>
          <v-list>
            <template v-for="(transaction, index) in transactions[dateKey]">
              <v-card flat tile style="margin: 8px" ripple @click.native="goToDetail(transaction)">
                <v-layout column>
                  <v-layout raw align-center>
                    <span>{{transaction.timeString}}</span>
                    <v-spacer></v-spacer>
                    <template v-if="transaction.message.payload">
                      <span>Message</span>
                      <img width="16" height="16" src="../../../assets/icon_check_gray_on.png">
                    </template>
                    <template v-if="transaction.mosaics.length > 0">
                      <span style="margin-left: 8px">Mosaic</span>
                      <img width="16" height="16" src="../../../assets/icon_check_gray_on.png">
                    </template>
                  </v-layout>
                  <v-layout raw style="margin-top: 8px" align-center>
                    <div style="width: 16px; height: 16px">
                      <template v-if="transaction.isReception" >
                        <img width="100%" src="../../../assets/icon_transaction_receive_green.png" />
                      </template>
                      <template v-else>
                        <img width="100%"  src="../../../assets/icon_transaction_receive_red.png">
                      </template>
                    </div>
                    <div :style="'margin-left: 8px; width: 16px; height: 16px; visibility: ' + (transaction.isReception ? 'visible' : 'hidden')">
                      <template v-if="transaction.isReception" >
                        <img width="100%" src="../../../assets/icon_multisignature_green.png" />
                      </template>
                      <template v-else>
                        <img width="100%" src="../../../assets/icon_multisignature_red.png">
                      </template>
                    </div>
                    <v-layout raw align-center style="margin-left: 8px">
                      <span v-if="transaction.isReception" class="app-large-text app-primary-text"><b>+</b></span>
                      <span v-else="transaction.isReception" class="app-large-text app-nem-orange-text"><b>-</b></span>
                      <template v-if="transaction.mosaics.length > 0">
                        <span class="app-large-text">{{transaction.mosaics.length === 1 ? '1 mosaic' : (transaction.mosaics.length + ' mosaics')}}</span>
                      </template>
                      <template v-else>
                        <span class="app-large-text">{{transaction.xemAmount.toString() + 'XEM'}} </span>
                      </template>
                      <v-spacer></v-spacer>
                      <img v-if="transaction.isConfirmed" width="16" height="16" src="../../../assets/icon_transaction_check.png">
                      <img v-else width="auto" height="16" src="../../../assets/icon_transaction_unconfirmed.png">
                    </v-layout>
                  </v-layout>
                  <span class="app-small-text app-secondary-text" style="margin-top: 8px">{{transaction.peer}}</span>
                </v-layout>
              </v-card>
              <v-divider v-if="index < transactions[dateKey].length - 1"></v-divider>
            </template>
          </v-list>
        </template>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  import ToolBar from '../../parts/ToolBar.vue';
  import WalletBar from '../../parts/WalletBar.vue';

  import TransactionModule from '../../mixins/TransactionModule';
  import {DateTimeFormatter} from 'js-joda';
  import {TransactionWrapper} from "../../../lib/transactionWrapper";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";

  const transactionDefault: { [key: string]: TransactionWrapper[]} = {};

  export default Vue.extend({
    mixins: [TransactionModule],
    components: {ToolBar, WalletBar},
    name: "TransactionList",

    data() {
      return {
        loadingTransaction: false,
        transactions: Object.assign({}, transactionDefault)
      }
    },
    methods: {
      settleTransactions() {
        this.transactions = {};
        const formatter = DateTimeFormatter.ofPattern('yyyyMMdd');

        const transactions = (this.unconfirmedTransactions || []).concat(this.confirmedTransactions || []);

        for (let transaction of transactions) {
          const dateKey = transaction.timeWindow.timeStamp.format(formatter);

          if (dateKey in this.transactions) {
            this.transactions[dateKey].push(transaction);
          } else {
            this.transactions[dateKey] = [transaction]
          }
        }
      },
      goToDetail(transaction: TransactionWrapper) {
        this.$store.commit(MUTATION_TYPES.SET_TRANSACTION, transaction);
        this.$router.push('/transaction/detail')
      }
    },
    async mounted() {
      this.loadingTransaction = true;
      await this.fetchTransactions(100, true, () => {
        this.settleTransactions();
        this.loadingTransaction = false;
      });
    }

  });
</script>
