<template>
  <div style="height: 100%">
    <v-toolbar app>
      <v-toolbar-title>My Wallet QR</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/top">
        <img height="32px" src="../../../assets/icon_check_gray.png" />
      </v-btn>
    </v-toolbar>
    <v-content app style="height: 100%">
      <wallet-bar :is-opened="false"></wallet-bar>

      <v-container style="margin-top: 40px">
        <v-layout column align-center>
          <qrcode-vue size="200" :value="invoiceData" v-if="address.length > 0"></qrcode-vue>
          <p style="margin-top: 32px" class="app-primary-text">{{$t('common.amount')}}</p>
          <p style="text-align: center">
            <span class="app-x-large-text" ><b>{{getXemDescription()}} XEM</b></span><br>
            <span class="app-large-text" >={{getFiatDescription()}} JPY</span>
          </p>
          <p class="app-primary-text">{{$t('common.destination')}}</p>
          <p style="text-align: center">{{address}}</p>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import {InvoiceData} from "../../../lib/invoiceData";
  import WalletBar from '../../parts/WalletBar.vue';
  import {getDivided} from "../../../lib/numberUtils";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {QrcodeVue,WalletBar},

    name: "InvoiceQR",
    props: {
      amount: {
        type: String,
        default: ''
      },
      rate: {
        type: String,
        default: '0'
      },
    },
    data () {
      return {
        address: '',
        invoiceData: '',
      }
    },
    methods: {
      getXemDescription(): string {
        return getDivided(Number(this.amount), 6).toString()
      },
      getFiatDescription(): string {
        return getDivided(Number(this.amount), 6).mul(Number(this.rate)).toString()
      }
    },
    async mounted() {
      const activeWallet = await WalletsHelper.getActive();
      if (activeWallet == null) {
        this.address = '';
      } else {
        this.address = activeWallet.address;
      }
      this.invoiceData = new InvoiceData(this.address, Number(this.amount)).toJsonString();
    }
  });

</script>

<style scoped>

</style>
