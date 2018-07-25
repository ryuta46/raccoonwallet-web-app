<template>
  <div>
    <tool-bar back="/wallet/creation/name" :title="$t('wallet.create_title')"></tool-bar>

    <v-content app>
      <img src="../../../assets/heroimage_new_large.png" style="width: 100%">
      <v-layout raw wrap align-center>
        <v-flex xs12>
          <p class="text-xs-center">{{ $t('wallet.create_message_0') }}<br>{{ $t('wallet.create_message_1') }}<br>{{ $t('wallet.create_message_2') }}</p>
        </v-flex>

        <v-flex xs12>
          <p class="app-primary-text text-xs-center">Your Address</p>
        </v-flex>

        <v-flex xs8 offset-xs2>
          <p class="text-xs-center">{{ activeWalletAddress }}</p>
        </v-flex>

        <v-flex xs12>
          <p class="text-xs-center">{{ $t('wallet.create_message_3') }}<br>{{ $t('wallet.create_message_4') }}<br>{{ $t('wallet.create_message_5') }}</p>
        </v-flex>

        <v-flex xs12>
          <v-layout column align-center>
            <v-btn color="primary" to="/wallet/creation/end">OK</v-btn>
          </v-layout>
        </v-flex>

      </v-layout>
    </v-content>
  </div>

</template>

<script>
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {ToolBar},
    name: "WalletCreationNew",
    data() {
      return {
        activeWalletAddress: ''
      }
    },
    async mounted() {
      this.activeWalletAddress = (await WalletsHelper.getActive()).address;
    }
  });
</script>

<style scoped>

</style>
