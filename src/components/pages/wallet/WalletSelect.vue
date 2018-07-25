<template>
  <div>
    <v-toolbar app>
      <v-toolbar-title>{{$t('wallet.select')}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content app>
      <wallet-bar v-model="updateWalletBar" :is-opened="true"></wallet-bar>
      <v-layout column style="width: 100vw">
        <img class="app-hero-image-large" src="../../../assets/heroimage_wallet_large.png" />
        <v-btn color="primary" to="/wallet/creation/type">Create New Wallet</v-btn>
        <template v-if="wallets.length === 0">
          <div style="text-align: center">
            <img class="empty-image" src="../../../assets/image_empty2_large.png" />
            <p class="app-large-text app-secondary-text">{{$t('wallet.no_wallet_title')}}</p>
            <p class="app-secondary-text" style="margin-left: 16px; margin-right: 16px">
              <span v-for="sentence in $t('wallet.no_wallet_message')">{{ sentence }}<br></span>
            </p>
            </div>
        </template>
        <v-radio-group v-model="activeIndex" v-else>
          <v-list>
            <div v-for="(wallet, index) in wallets" :key="index" >

              <v-list-tile avatar ripple @click="setActiveWallet(wallet)">
                <v-list-tile-action >
                  <v-radio :value="index" color="primary"></v-radio>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{wallet.name}}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon @click.stop="$router.push('/wallet/settings?id=' + wallet.id)">
                    <v-icon color="primary">settings</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider inset></v-divider>
            </div>
          </v-list>
        </v-radio-group>
      </v-layout>
    </v-content>
  </div>

</template>

<script lang="ts">
  import WalletBar from "../../parts/WalletBar";
  import {WalletsHelper, Wallet} from "../../../lib/storage";
  import Vue from 'vue'

  export default Vue.extend({
    components: {WalletBar},

    data () {
      return {
        updateWalletBar: false,
        activeIndex: 0,
        wallets: <Wallet[]>[],
      }
    },
    name: "WalletSelect",

    methods: {
      async setActiveWallet(wallet: Wallet) {
        await WalletsHelper.setActive(wallet.id);
        this.activeIndex = await this.getActiveWalletIndex();
        this.updateWalletBar = true;
      },

      async getActiveWalletIndex(): Promise<number> {
        const wallets = await WalletsHelper.gets();
        const activeWallet = await WalletsHelper.getActive();
        if (!activeWallet) {
          return -1;
        }
        for (let index = 0; index < wallets.length; index++ ) {
          if (wallets[index].id === activeWallet.id) {
            return index;
          }
        }
        return -1;
      }
    },
    async mounted () {
      this.activeIndex = await this.getActiveWalletIndex();
      this.wallets = await WalletsHelper.gets();
    },
  });
</script>

<style scoped>
  .empty-image {
    width: 50vw;
    max-width: 150px;
  }
</style>
