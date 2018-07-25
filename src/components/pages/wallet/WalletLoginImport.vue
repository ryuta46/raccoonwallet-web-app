<template>
  <div>
    <tool-bar back="/wallet/creation/type" :title="$t('wallet.import_title')"></tool-bar>

    <v-content app>
      <img src="../../../assets/heroimage_login_large.png" style="width: 100%">
      <v-layout raw wrap>
        <v-flex xs10 offset-xs1>
          <p class="text-xs-center">
            <span v-for="sentence in $t('wallet.import_message')">{{ sentence }}<br></span>
          </p>
        </v-flex>

        <v-flex xs8 offset-xs2>
          <v-layout row align-center>
            <v-text-field
              id="key"
              name="key"
              v-model="key"
              label="Enter secret key"
            ></v-text-field>
            <v-btn icon>
              <img height="50%" src="../../../assets/icon_home_scan_gray.png">
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex xs12 justify-center>
          <v-layout column align-center>
            <v-btn color="primary" :disabled="prohibited()" @click="createWallet">OK</v-btn>
          </v-layout>
        </v-flex>
        <v-flex xs12 style="margin-top: 32px">
          <p class="text-xs-center" style="font-size: small">{{ $t('common.privacy_policy_caution') }}<br>
            <router-link to="/"><u>{{ $t('common.privacy_policy') }}</u></router-link>
          </p>
        </v-flex>
      </v-layout>
    </v-content>
    <pin-dialog v-model="showPinDialog" mode="check" @pass="onPassed"></pin-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Password, SimpleWallet} from "nem-library";
  import ToolBar from "../../parts/ToolBar.vue";
  import PinDialog from "../../parts/PinDialog.vue";
  import {WalletsHelper, Wallet, PinCodeHelper} from "../../../lib/storage";
  import MessageModule from "../../mixins/MessageModule";

  export default Vue.extend({
    mixins: [MessageModule],
    components: {ToolBar, PinDialog},
    name: "WalletLoginImport",

    data() {
      return {
        key: "",
        showPinDialog: false,
      }
    },
    methods: {
      prohibited () {
        return this.key.length == 0;
      },

      async createWallet () {
        if (!await PinCodeHelper.hasSavedCode()) {
          await this.createWalletWithPin(PinCodeHelper.defaultPin);
        } else {
          this.showPinDialog = true;
        }
      },

      async createWalletWithPin(pinCode: string) {
        const pass = new Uint8Array(32);
        crypto.getRandomValues(pass);
        const password = new Password(pass.toString());

        try {
          const simpleWallet = SimpleWallet.createWithPrivateKey('Imported', password, this.key);
          const account = simpleWallet.open(password);
          const wallet = await WalletsHelper.createWithKeys(
              simpleWallet.name,
              simpleWallet.address.pretty(),
              account.publicKey,
              account.privateKey,
              pinCode);

          await WalletsHelper.add(wallet);
          await WalletsHelper.setActive(wallet.id);
          this.$router.push('/wallet/login/name');
        }
        catch {
          this.showError(this.$t('wallet.invalid_key').toString());
        }
      },

      async onPassed(pin: string) {
        await this.createWalletWithPin(pin);
      },
    }
  });
</script>


<style scoped>

</style>
