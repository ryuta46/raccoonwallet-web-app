<template>
  <div style="min-height: 100vh">
    <tool-bar v-if="lesson" back="/lesson/key/caution" :title="$t('common.security_lesson')"></tool-bar>
    <tool-bar v-else="lesson" :back="'/wallet/backup_caution?id=' + id" :title="$t('common.backup')"></tool-bar>

    <v-content app>
      <img class="app-hero-image" src="../../../assets/heroimage_wallet_small.png">
      <v-layout raw wrap style="margin-bottom: 40px">
        <v-flex xs12 style="margin-top: 16px">
          <v-layout raw justify-center align-center>
            <img width="16" height="16" src="../../../assets/icon_caution.png">
            <span>{{$t('wallet.key_backup_title') }}</span>
          </v-layout>
        </v-flex>

        <v-flex xs10 offset-xs1 style="margin-top: 16px">
          <p class="text-xs-center">{{ $t('wallet.key_backup_message') }}</p>
        </v-flex>

        <v-flex xs10 offset-xs1 style="margin-top: 16px">
          <p class="text-xs-center" style="color: red">Private Key</p>
        </v-flex>

        <v-flex xs10 offset-xs1 style="margin-top: 16px">
          <p class="text-xs-center" style="word-break: break-all">{{ key }}</p>
        </v-flex>

      </v-layout>

      <v-layout class="app-bottom-container" column align-center>
        <v-btn v-if="lesson" color="primary" small to="/lesson/beginner_backup_end">{{ $t('common.done')}}</v-btn>
        <v-btn v-else color="primary" small @click="goBackSettings">{{ $t('common.done')}}</v-btn>
      </v-layout>

    </v-content>
    <pin-dialog v-model="showPinDialog" mode="check" @pass="onPassed"></pin-dialog>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import PinDialog from "../../parts/PinDialog.vue";
  import {PinCodeHelper, WalletsHelper, Wallet} from "../../../lib/storage";
  import {Environment} from "../../../lib/environment";

  export default Vue.extend({
    components: {ToolBar, PinDialog},
    name: "WalletBackup",
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
    data () {
      return {
        key: "",
        showPinDialog: false
      }
    },
    methods: {
      async onPassed(pin: string) {
        const wallet = await this.getWallet();
        if (wallet != null) {
          this.key = (await WalletsHelper.decryptKey(wallet.id, pin)) || "";
        }
      },
      async getWallet(): Promise<Wallet | null> {
        if (this.id.length == 0) {
          return await WalletsHelper.getActive();
        } else {
          return await WalletsHelper.get(this.id);
        }
      },

      goBackSettings() {
        if (Environment.isIos() && Environment.isInStandaloneMode()) {
          this.$router.push('/wallet/settings?id=' + this.id);
        } else {
          this.$router.go(-2);
        }
      }
    },

    async mounted () {
      const wallet = await this.getWallet();
      if (wallet == null) {
        this.key = "";
      } else {
        if (!await PinCodeHelper.hasSavedCode()) {
          this.key = wallet.decryptSecret(PinCodeHelper.defaultPin) || '';
        }
        else {
          this.showPinDialog = true;
        }
      }
    },
  });
</script>

<style scoped>

</style>
