<template>
  <div height="100%">
    <v-toolbar app>
      <v-toolbar-title>{{ $t('send.complete_title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>


    <v-content app>
      <v-layout column align-center >
        <wallet-bar :is-opened="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png"  />
        <img width="100%" src="../../../assets/image_transaction_background_top.png" style="max-width: 480px"/>

        <p class="app-x-large-text app-primary-text" style="text-align: center; margin-top: -48px;">
          <span v-for="sentence in $t('send.complete_message')">{{ sentence }}<br></span>
        </p>

        <v-layout column style="z-index: 1">
          <v-btn block color="primary" to="/top?tab=home">HOME</v-btn>
          <v-btn block dark color="nemOrange" to="/transaction/list">Transaction</v-btn>
        </v-layout>
        <div class="app-bottom-fix" style="max-width: 480px; display: block; margin-left: auto; margin-right: 0">
          <img style="margin-bottom: -8px; z-index: 0" width="100%" src="../../../assets/image_transaction_background_bottom.png" />
        </div>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';

  export default Vue.extend({
    components: {WalletBar},
    name: "SendComplete",
  });
</script>

<style scoped>

</style>
