<template>
  <div>
    <tool-bar :back="'/wallet/settings?id=' + id" :title="$t('common.address')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="false" :id="id" :icon="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

        <v-container>
          <v-layout column align-center>
            <qrcode-vue size="200" :value="getInvoiceData()" v-if="address.length > 0"></qrcode-vue>
            <p style="margin-top: 32px" class="app-primary-text">Your Address</p>
            <p style="text-align: center">{{address}}</p>
          </v-layout>
        </v-container>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import {InvoiceData} from "../../../lib/invoiceData";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {QrcodeVue, ToolBar, WalletBar},
    name: "WalletAddress",
    props: {
      id: String
    },
    computed: {
      async address(): Promise<string> {
        const wallet = await WalletsHelper.get(this.id);
        if (wallet == null) {
          return '';
        } else {
          return wallet.address;
        }
      }
    },
    methods: {
      async getInvoiceData(): Promise<string> {
        return new InvoiceData(await this.address).toJsonString();
      },
    }
  });
</script>

