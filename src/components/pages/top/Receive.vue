<template>
  <v-layout column>
    <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

    <v-container>
      <v-layout column align-center>
        <qrcode-vue size="200" :value="invoiceData" v-if="address.length > 0"></qrcode-vue>
        <p style="margin-top: 32px" class="app-primary-text">Your Address</p>
        <p style="text-align: center">{{address}}</p>
      </v-layout>
    </v-container>
  </v-layout>

</template>

<script lang="ts">
  import Vue from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import {InvoiceData} from "../../../lib/invoiceData";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {QrcodeVue},
    name: "ReceiveView",
    data () {
      return {
        address: '',
        invoiceData: ''
      }
    },
    computed: {
    },
    async mounted() {
      const activeWallet = await WalletsHelper.getActive();
      if (activeWallet == null) {
        this.address = '';
      } else {
        this.address = activeWallet.address;
      }
      this.invoiceData = new InvoiceData(this.address).toJsonString();
    }

  });
</script>
