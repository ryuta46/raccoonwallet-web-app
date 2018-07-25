<template>
  <div>
    <tool-bar back="/wallet/creation/type" :title="$t('wallet.name_title')"></tool-bar>

    <v-content app>
      <img src="../../../assets/heroimage_new_large.png" style="width: 100%">
      <v-layout raw wrap>
        <v-flex xs12>
          <p class="text-xs-center">{{ $t('wallet.name_message_0') }}<br>{{ $t('wallet.name_message_1') }}<br>{{ $t('wallet.name_message_2') }}</p>
        </v-flex>

        <v-flex xs8 offset-xs2>
          <v-text-field
            id="walletName"
            name="walletName"
            v-model="walletName"
            :label="$t('wallet.name_input')"
          ></v-text-field>
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
  import Vue from 'vue'
  import {Password, SimpleWallet} from "nem-library";
  import ToolBar from "../../parts/ToolBar.vue";
  import PinDialog from "../../parts/PinDialog.vue";
  import {PinCodeHelper, WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {ToolBar, PinDialog},
    name: "WalletCreationName",

    data() {
      return {
        walletName: "",
        showPinDialog: false,
      }
    },
    methods: {
      prohibited () {
        return this.walletName.length == 0;
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

        const simpleWallet = SimpleWallet.create(this.walletName, password);
        const account = simpleWallet.open(password);
        const wallet = await WalletsHelper.createWithKeys(
            simpleWallet.name,
            simpleWallet.address.pretty(),
            account.publicKey,
            account.privateKey,
            pinCode);
        await WalletsHelper.add(wallet);
        await WalletsHelper.setActive(wallet.id);
        this.$router.push('/wallet/creation/new');
      },

      async onPassed(pin: string) {
        await this.createWalletWithPin(pin);
      },
    },
  });
</script>

<style scoped>

</style>
