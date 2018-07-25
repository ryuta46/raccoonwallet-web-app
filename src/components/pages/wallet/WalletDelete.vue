<template>
  <div style="background-color: #606060; min-height: 100vh">
    <tool-bar :back="'/wallet/settings?id=' + id" :title="$t('common.delete')"></tool-bar>
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
            <span v-for="sentence in $t('wallet.delete_caution_message')" style="color: white">{{ sentence }}<br></span>
          </p>
        </v-flex>
      </v-layout>

      <v-layout class="app-bottom-container" raw justify-center>
        <v-btn color="primary" small @click="deleteWallet">REMOVE</v-btn>
        <v-btn color="secondary" small style="margin-left: 64px" @click="goBackSettings">CANCEL</v-btn>
      </v-layout>
    </v-content>
    <dialog-pin v-model="showPinDialog" mode="check" @cancel="goBackSettings"></dialog-pin>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import {Environment} from "../../../lib/environment";
  import DialogPin from '../../parts/PinDialog.vue';
  import {PinCodeHelper, WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {ToolBar, DialogPin},
    name: "WalletDelete",
    props: {
      id: String
    },
    data () {
      return {
        showPinDialog: false
      };
    },
    methods: {
      async deleteWallet() {
        await WalletsHelper.delete(this.id);
        this.goBackSelect();
      },

      goBackSelect() {
        if (Environment.isIos() && Environment.isInStandaloneMode()) {
          this.$router.push('/wallet/select');
        } else {
          this.$router.go(-2);
        }
      },

      goBackSettings() {
        if (Environment.isIos() && Environment.isInStandaloneMode()) {
          this.$router.push('/wallet/settings?id=' + this.id);
        } else {
          this.$router.go(-1);
        }
      }
    },
    async mounted () {
      if (await PinCodeHelper.hasSavedCode()) {
        this.showPinDialog = true;
      }
    }
  });
</script>
