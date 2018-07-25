<template>
  <div style="background-color: #606060; min-height: 100vh">

    <tool-bar v-if="lesson" :back="$store.state.backPathFromKey" :title="$t('common.security_lesson')"></tool-bar>
    <tool-bar v-else :back="'/wallet/settings?id=' + id" :title="$t('common.backup')"></tool-bar>
    <v-content app>
      <img class="app-hero-image" src="../../../assets/heroimage_wallet_small.png">
      <v-layout raw wrap style="margin-bottom: 40px">
        <v-flex xs12>
          <v-layout raw justify-center align-center>
            <img width="16" height="16" src="../../../assets/icon_caution.png">
            <span style="color: white">{{$t('wallet.key_caution_title') }}</span>
          </v-layout>
        </v-flex>

        <v-flex xs10 offset-xs1 style="margin-top: 8px">
          <p class="text-xs-center">
            <span v-for="sentence in $t('wallet.key_caution_message')" style="color: white">{{ sentence }}<br></span>
          </p>
        </v-flex>
      </v-layout>

      <v-layout class="app-bottom-container" column align-center>
        <v-btn v-if="lesson" color="primary" small to="/lesson/key">OK</v-btn>
        <v-btn v-else color="primary" small :to="'/wallet/backup?id=' + id">OK</v-btn>
      </v-layout>
    </v-content>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar";

  export default Vue.extend({
    components: {ToolBar},
    name: "WalletBackupCaution",
    props: {
      id: {
        type: String,
        default: ''
      },
      lesson: {
        type: Boolean,
        default: false
      },
    },
  });
</script>
