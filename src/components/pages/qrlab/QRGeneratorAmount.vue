<template>
  <div style="height: 100%">
    <v-toolbar app>
      <v-btn icon to="/top?tab=qrlab"><v-icon color="primary">arrow_back</v-icon></v-btn>
      <v-toolbar-title>{{$t('qrlab.amount_title')}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content app style="height: 100%">
      <wallet-bar :is-opened="false"></wallet-bar>
      <v-layout column>
        <img class="app-hero-image" src="../../../assets/heroimage_qr_labo_small.png" />

        <v-container>
          <v-layout row width="100%" align-center>
            <v-flex xs10>
              <p class="app-primary-text">{{$t('common.amount')}}</p>
              <p class="app-x-large-text">
                {{$store.state.calculatorFormula}}
                <span v-if="baseIsXem">XEM</span>
                <span v-else>JPY</span>
              </p>
              <v-progress-circular v-if="rate === 0" indeterminate color="primary"></v-progress-circular>
              <p v-else class="app-large-text">= {{getTargetPrice($store.state.calculatorValue).toString()}}
                <span v-if="baseIsXem">JPY</span>
                <span v-else>XEM</span>
              </p>
            </v-flex>
            <v-flex xs2>
              <v-btn fab color="primary" @click="onClickedBaseChange">
                <img width="50%" src="../../../assets/icon_recycle.png">
              </v-btn>
            </v-flex>
          </v-layout>

        </v-container>
      </v-layout>
      <div class="app-bottom-fix" style="max-width: 480px">
        <calculator :to="'/qrlab/invoice?amount=' + getXemAmount() + '&rate=' + rate"></calculator>
      </div>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import Calculator from '../../parts/Calculator.vue';
  import {getXemRate} from "../../../lib/exchangeUtils";
  import {roundAt} from "../../../lib/numberUtils";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";
  import {Decimal} from 'decimal.js';
  export default Vue.extend({
    components: {
      Calculator,
      WalletBar},
    name: "QRGeneratorAmount",

    data() {
      return {
        rate: new Decimal(0),
        baseIsXem: true,
      }
    },
    methods: {
      getTargetPrice(basePrice: number): Decimal {
        if (this.rate === new Decimal(0)) {
          return new Decimal(0);
        }
        if (this.baseIsXem) {
          return new Decimal(basePrice).mul(this.rate);
        } else {
          return new Decimal(basePrice).div(this.rate);
        }
      },

      getXemAmount() {
        let xem = new Decimal(this.$store.state.calculatorValue);
        if (!this.baseIsXem) {
          xem = this.getTargetPrice(xem.toNumber());
        }
        return Math.round(xem.mul(10 ** 6).toNumber());
      },

      onClickedBaseChange() {
        const targetValue = this.getTargetPrice(this.$store.state.calculatorValue);
        this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_FORMULA, targetValue.toString());
        this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_VALUE, targetValue);
        this.baseIsXem = !this.baseIsXem;
      }
    },

    mounted() {
      getXemRate().then((rate) => {
        this.rate = roundAt(rate, 5);
      });
    }
  });
</script>

<style scoped>

</style>
