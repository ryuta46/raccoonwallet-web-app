<template>
  <div style="height: 100%">
    <tool-bar back="/top?tab=send" :title="$t('qrlab.amount_title')"></tool-bar>
    <v-content app style="height: 100%">
      <wallet-bar :is-opened="false"></wallet-bar>
      <v-layout column>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

        <v-tabs slot="extension" v-model="type" grow slider-color="primary">
          <v-tab href="#amount">送金操作</v-tab>
          <v-tab href="#mosaic">モザイク添付</v-tab>
        </v-tabs>
        <v-tabs-items v-model="type" touchless>
          <v-tab-item id="amount">
            <v-container>
              <v-flex xs12 >
                <v-layout justify-center>
                  <div @change="currency"
                       v-for="name in Object.keys($store.state.sendMosaics).sort()" :key="name"
                       :class="currency === name ? 'app-pager-indicator' : 'app-pager-indicator-inactive'"
                       @click="currency = name" >
                  </div>
                </v-layout>
              </v-flex>
              <v-flex xs10 offset-xs1>
                <div>
                  <v-tabs-items v-model="currency">
                    <div style="display: flex; flex-direction: column">
                      <v-tab-item v-for="name in Object.keys($store.state.sendMosaics).sort()" :key="name" :id="name" >
                        <v-layout row width="100%" align-center>
                          <v-flex xs12>
                            <p class="app-primary-text">{{$t('common.amount')}}</p>
                            <p class="app-x-large-text">{{$store.state.calculatorFormula}} {{name === 'nem:xem' ? 'XEM' : name}} </p>
                          </v-flex>
                        </v-layout>
                      </v-tab-item>
                    </div>
                  </v-tabs-items>
                </div>
              </v-flex>
            </v-container>
          </v-tab-item>
          <v-tab-item id="mosaic">
            <v-layout row width="100%" style="margin-top: 16px" v-if="attachments.length > 0">
              <v-flex xs10>
                <span style="display: block; text-align: right; margin-top: 6px; margin-right: 8px">{{ $t('send.amount_with_xem') }}</span>
              </v-flex>
              <v-flex xs2>
                <v-switch v-model="sendXem"></v-switch>
              </v-flex>
            </v-layout>
            <v-list>
              <template v-for="mosaic in ownedMosaics">
                <v-list-tile v-if="mosaic.mosaicId.description() !== 'nem:xem'" :key="mosaic.mosaicId.description()" @click="switchAttachment(mosaic.mosaicId.description())">
                  <v-list-tile-action>
                    <v-checkbox v-model="attachments" :value="mosaic.mosaicId.description()" @click="switchAttachment(mosaic.mosaicId.description())"></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{mosaic.mosaicId.description()}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-title><p style="text-align: right">{{mosaic.amount.toString()}}</p></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
              </template>
            </v-list>
          </v-tab-item>

        </v-tabs-items>

      </v-layout>

      <div class="app-bottom-fix" :style="'max-width: 480px;' + (type === 'amount' ? '' : 'visibility: hidden')">
        <calculator to="/send/mode?transition=fade-left"></calculator>
      </div>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import Calculator from '../../parts/Calculator.vue';
  import {MosaicTransferable, XEM} from "nem-library";
  import {createWithNewAmount} from "../../../lib/mosaicUtils";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes"
  import ToolBar from "../../parts/ToolBar.vue";
  import {WalletsHelper} from "../../../lib/storage";
  import BalanceModule from "../../mixins/BalanceModule";

  export default Vue.extend({
    mixins: [BalanceModule],
    components: {
      ToolBar,
      Calculator, WalletBar},
    name: "SendAmount",
    data () {
      return {
        type: "amount",
        currency: Object.keys(this.$store.state.sendMosaics)[0],
        sendXem: Object.keys(this.$store.state.sendMosaics).indexOf('nem:xem') >= 0,
        attachments: Object.keys(this.$store.state.sendMosaics).filter(value => value != 'nem:xem'), // attachment mosaics not included xem
      }
    },
    computed : {
      calculatorValue (): number {
        return this.$store.state.calculatorValue
      }
    },
    methods: {
      updateSendAmount() {
        const notSendXem = this.attachments.length > 0 && !this.sendXem;
        if (notSendXem) {
          this.$store.commit(MUTATION_TYPES.REMOVE_SEND_MOSAIC, 'nem:xem');
        } else if (Object.keys(this.$store.state.sendMosaics).indexOf('nem:xem') < 0) {
          this.$store.commit(MUTATION_TYPES.ADD_SEND_MOSAIC, new XEM(0));
        }

        for (let attachment of this.attachments) {
          if (!(attachment in this.$store.state.sendMosaics)) {
            const mosaicInfo = this.getOwnedMosaicInfo(attachment);
            if (mosaicInfo != null) {
              const newMosaic = createWithNewAmount(mosaicInfo, 0);
              this.$store.commit(MUTATION_TYPES.ADD_SEND_MOSAIC, newMosaic);
            }
          }
        }
        for (let attachment in this.$store.state.sendMosaics) {
          if (attachment === 'nem:xem') {
            continue;
          }
          if (this.attachments.indexOf(attachment) < 0) {
            this.$store.commit(MUTATION_TYPES.REMOVE_SEND_MOSAIC, attachment)
          }
        }
      },
      switchAttachment(fullName: string) {
        const index = this.attachments.indexOf(fullName);
        if (index >= 0) {
          this.attachments.splice(index, 1);
        } else {
          this.attachments.push(fullName);
        }
      },
      getOwnedMosaicInfo(fullName: string): MosaicTransferable | null {
        for (let mosaic of this.ownedMosaics) {
          if (mosaic.mosaicId.description() === fullName) {
            return mosaic;
          }
        }
        return null;
      }
    },

    async mounted () {
      const activeWallet = await WalletsHelper.getActive();
      if (!activeWallet) {
        return;
      }
      await this.fetchBalance(true);

      if (this.currency in this.$store.state.sendMosaics) {
        const mosaicInfo: MosaicTransferable = this.$store.state.sendMosaics[this.$data.currency];
        this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_FORMULA, mosaicInfo.amount.toString())
      }
    },
    watch : {
      attachments () {
        this.updateSendAmount();
      },
      sendXem () {
        this.updateSendAmount();
      },

      calculatorValue () {
        const mosaicInfo = this.getOwnedMosaicInfo(this.$data.currency);
        if (mosaicInfo != null) {
          const newMosaic = createWithNewAmount(mosaicInfo, this.$store.state.calculatorValue);
          this.$store.commit(MUTATION_TYPES.ADD_SEND_MOSAIC, newMosaic);
        }
      },

      type() {
        if (!(this.$data.currency in this.$store.state.sendMosaics)) {
          this.$data.currency = Object.keys(this.$store.state.sendMosaics)[0];
        }
      },

      currency() {
        // delay for waiting the tab scrolled
        window.setTimeout( () => {
          const mosaicInfo: MosaicTransferable = this.$store.state.sendMosaics[this.$data.currency];
          if (mosaicInfo) {
            this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_FORMULA, mosaicInfo.amount.toString())
          }
        }, 300 );
      },
    }
  });
</script>

<style scoped>

</style>
