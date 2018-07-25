<template>
  <div style="width: 100vw">
    <tool-bar back="/top?tab=home" title="Raccoon Wallet"></tool-bar>
    <v-content app>
      <wallet-bar :is-opened="false"></wallet-bar>
      <v-container>
        <v-layout column style="margin-top: 40px">
          <v-flex>
            <v-card>
              <v-layout column >
                <v-flex>
                  <img class="tab-icon" src="../../../assets/tab_home_balance.png">
                </v-flex>
                <v-flex>
                  <v-layout row wrap align-baseline>
                    <v-flex xs10>
                      <p :style="styles.xemAmount">{{balance.toString()}}</p>
                    </v-flex>
                    <v-flex xs2>
                      <p :style="styles.xemUnit">xem</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <img class="balance-background" src="../../../assets/image_home_balance_background.png">
            </v-card>
          </v-flex>
          <v-flex style="margin-top: 40px">
            <p>{{ $t('common.mosaic_list') }}</p>
          </v-flex>
        </v-layout>
      </v-container>
      <v-list>
        <template v-for="mosaic in ownedMosaics">
          <template v-if="mosaic.mosaicId.description() !== 'nem:xem'">
            <v-list-tile :key="mosaic.mosaicId.description()" >
              <v-list-tile-content>
                <v-list-tile-title>{{mosaic.mosaicId.description()}}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title><p style="text-align: right">{{mosaic.amount.toString()}}</p></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </template>
        </template>
      </v-list>

    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Theme from '../../../raccoonTheme'
  import WalletBar from '../../parts/WalletBar.vue'
  import ToolBar from "../../parts/ToolBar.vue";

  import BalanceModule from '../../mixins/BalanceModule'

  export default Vue.extend({
    mixins: [BalanceModule],
    components: {
      ToolBar,
      WalletBar},
    name: "Balance",

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
        },
      }
    },
    async mounted () {
      await this.fetchBalance(true);
    },
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
</style>
