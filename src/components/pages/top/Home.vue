<template>
  <v-container style="width: 100vw">
    <v-layout column style="margin-top: 40px">
      <v-flex>
        <v-card to="/balance" ripple>
          <v-layout column >
            <v-flex>
              <img class="tab-icon" src="../../../assets/tab_home_balance.png">
            </v-flex>
            <v-flex v-if="loadingBalance || loadingRate">
              <v-layout column align-center>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-layout>
            </v-flex>
            <v-flex v-else>
              <v-layout row wrap align-baseline>
                <v-flex xs10>
                  <p :style="styles.xemAmount">{{balance.toString()}}</p>
                </v-flex>
                <v-flex xs2>
                  <p :style="styles.xemUnit">xem</p>
                </v-flex>
                <v-flex xs12>
                  <p :style="styles.jpyAmount">JPY : {{fiat.toString()}}</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <img class="balance-background" src="../../../assets/image_home_balance_background.png">
        </v-card>
      </v-flex>
      <v-flex style="margin-top: 16px">
        <v-card to="/transaction/list">
          <v-layout column>
            <v-flex>
              <img class="tab-icon" src="../../../assets/tab_home_transaction.png">
            </v-flex>
            <v-flex>
              <v-card flat tile>
                <v-layout row wrap>
                  <v-flex xs9 v-if="loadingTransaction">
                    <v-layout column align-center style="height: 64px">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-layout>
                  </v-flex>
                  <v-flex xs9 v-else-if="transactions.length === 0">
                    <v-layout row>
                    <v-flex>
                      <img class="empty-transaction-icon" src="../../../assets/image_empty1_small.png">
                    </v-flex>
                    <v-flex>
                      <p class="app-hint-text" style="text-align: center; margin-top: 8px">You have no current<br>transaction.</p> </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs9 v-else>
                    <table width="100%" style="margin-top: -8px;">
                      <tr v-for="(transaction,i) in transactions" :key="i">
                        <td align="center"><span style="margin-left: 8px" class="app-small-text">{{ transaction.dateString }}</span></td>
                        <td align="center">
                          <div style="width: 16px; height: 16px">
                            <template v-if="transaction.isReception" >
                              <img width="100%" src="../../../assets/icon_transaction_receive_green.png" />
                            </template>
                            <template v-else>
                              <img width="100%"  src="../../../assets/icon_transaction_receive_red.png">
                            </template>
                          </div>
                        </td>
                        <td align="center">
                          <div style="width: 16px; height: 16px">
                            <template v-if="transaction.isMultisig" >
                              <template v-if="transaction.isReception" >
                                <img width="100%" v-if="transaction.isReception" src="../../../assets/icon_multisignature_green.png" />
                              </template>
                              <template v-else>
                                <img width="100%" src="../../../assets/icon_multisignature_red.png">
                              </template>
                            </template>
                          </div>
                        </td>
                        <td align="right" >
                          <span v-if="transaction.mosaics.length === 0" class="app-small-text" >{{transaction.xemAmount.toString()}} XEM</span>
                          <span v-else class="app-small-text" >MOSAIC</span>
                        </td>
                      </tr>
                      <template v-if="transactions.length < 4">
                        <tr v-for="j in (4 - transactions.length)" :key="j + transactions.length - 1">
                          <td><div style="width: 16px; height: 16px"></div></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </template>
                    </table>

                  </v-flex>
                  <v-flex xs3>
                    <div :style="styles.transactionIcon">
                      <v-card-media :src="require('@/assets/icon_home_transaction.png')" contain height="100%" >
                      </v-card-media>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex style="margin-top: 16px">
        <v-card>
          <v-layout column>
            <v-flex>
              <img class="tab-icon" src="../../../assets/tab_home_harvest.png">
            </v-flex>
            <v-flex>
              <v-card flat tile>
                <v-layout row wrap>
                  <v-flex xs9 v-if="harvests.length === 0">
                    <v-layout row>
                      <v-flex>
                        <img class="empty-harvest-icon" src="../../../assets/image_empty2_small.png">
                      </v-flex>
                      <v-flex>
                        <p class="app-hint-text" style="text-align: center; margin-top: -8px">You have no current<br>harvesting.</p> </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs9 v-else>
                  </v-flex>
                  <v-flex xs3>
                    <div :style="styles.harvestIcon">
                      <v-card-media :src="require('@/assets/icon_home_harvest.png')" contain height="100%" >
                      </v-card-media>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Theme from '../../../raccoonTheme';
  import {roundAt} from "../../../lib/numberUtils";
  import {getXemRate} from "../../../lib/exchangeUtils";
  import {Decimal} from 'decimal.js'
  import MessageDialog from "../../parts/MessageDialog";
  import {TransactionWrapper} from "../../../lib/transactionWrapper";
  import {WalletsHelper} from "../../../lib/storage";
  import BalanceModule from "../../mixins/BalanceModule";
  import TransactionModule from "../../mixins/TransactionModule";

  export default Vue.extend({
    mixins: [BalanceModule, TransactionModule],
    components: {MessageDialog},
    name: "HomeView",

    props: {
      needsUpdate: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        styles: {
          xemAmount: {
            fontSize: 'x-large',
            textAlign: 'left',
            marginLeft: '16px'
          },
          xemUnit: {
            textAlign: 'right',
            marginRight: '16px',
            color: Theme.textDarkGray
          },
          jpyAmount: {
            textAlign: 'right',
            marginTop: '-8px',
            marginRight: '16px',
            color: Theme.textDarkGray
          },
          transactionIcon: {
            backgroundColor: Theme.nemBlue,
            padding: '16px',
            marginTop: '-8px',
            marginRight: '16px',
            height: '90%',
          },
          harvestIcon: {
            backgroundColor: Theme.primary,
            padding: '4px',
            marginTop: '-8px',
            marginRight: '16px',
            height: '32px',
          },
        },
        loadingBalance: true,
        loadingRate: true,
        loadingTransaction: true,
        fiat: 0,
        rate: 0,
        transactions: <TransactionWrapper[]>[],
        harvests: []
      }
    },
    methods: {
      updatedFiat () {
        this.fiat = roundAt(new Decimal(this.balance).mul(this.rate).toNumber(), 3).toNumber();
      },
      updatedTransactions () {
        this.transactions = (this.confirmedTransactions || []).filter((value, index) => index < 4);
      },
      async update() {
        this.loadingBalance = this.loadingRate = this.loadingTransaction = true;
        const activeWallet = await WalletsHelper.getActive();
        if (activeWallet == null) {
          this.fiat = 0;
          this.transactions = <TransactionWrapper[]>[];
          this.loadingBalance = this.loadingRate = this.loadingTransaction = false;
          return;
        }
        // Balance
        await this.fetchBalance(false, () => {
          this.updatedFiat();
          this.loadingBalance = false;
        });

        // Fiat
        getXemRate().then((rate) => {
          this.rate = rate;
          this.updatedFiat();
          this.loadingRate = false;
        });

        await this.fetchTransactions(10, false, () => {
          this.updatedTransactions();
          this.loadingTransaction = false;
        });

      }
    },
    async mounted () {
      await this.update()
    },
    watch : {
      needsUpdate: async function (needs: Boolean) {
        if (needs) {
          await this.update();
        }
      }
    }
  });
</script>

<style scoped>
  .tab-icon {
    margin-left: 16px;
    height: 32px;
  }
  .balance-background {
    display: block;
    margin-top: -24px;
    margin-left: auto;
    margin-bottom: -8px;
    max-width: 190px;
    width: 60%;
  }
  .empty-transaction-icon {
    display: inline-block;
    margin-top:8px;
    margin-bottom: 8px;
    margin-left: 16px;
    height: 60px;

  }
  .empty-harvest-icon {
    display: inline-block;
    margin-top: -8px;
    margin-left: 16px;
    height: 40px;
  }
</style>
