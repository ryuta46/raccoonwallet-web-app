<template>
  <div class="wallet-bar-container">
    <div class="wallet-bar-content-container">
      <img class="wallet-bar" src="../../assets/image_walletbar.png" />
      <v-btn v-if="icon" class="wallet-icon" float icon small color="primary" @click="onClickWallet">
        <img v-if="isOpened" width="16px" src="../../assets/icon_wallet_back.png" />
        <img v-else width="16px" src="../../assets/icon_wallet.png" />
      </v-btn>
      <p class="wallet-name">{{ walletName }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import {MUTATION_TYPES} from "../../lib/mutationTypes";
  import Vue from 'vue';
  import {Environment} from "../../lib/environment";
  import {WalletsHelper, Wallet} from "../../lib/storage";

  export default Vue.extend({
    name: "WalletBar",

    props: {
      isOpened: Boolean,
      id: {
        type: String,
        default: ""
      },
      value: {
        type: Boolean,
        default: true
      },
      icon: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        walletName: ''
      }
    },
    methods: {
      onClickWallet() {
        if (this.isOpened) {
          if (Environment.isIos() && Environment.isInStandaloneMode()) {
            this.$router.push(this.$store.state.backPathFromWalletSelect);
          } else {
            this.$router.go(-1);
          }
        } else {
          this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_WALLET_SELECT, this.$router.currentRoute.fullPath);
          this.$router.push('/wallet/select');
        }
      },
      async refresh () {
        this.walletName = await this.getWalletName();
        this.$emit('input', false);
      },
      async getWalletName (): Promise<string> {
        const wallet = await this.getTargetWallet();
        if (wallet === null) {
          return this.$t('common.not_select').toString();
        }
        else {
          return wallet.name
        }
      },
      async getTargetWallet (): Promise<Wallet | null> {
        if (this.id.length == 0) {
          return await WalletsHelper.getActive();
        } else {
          return await WalletsHelper.get(this.id);
        }
      },

    },
    async mounted () {
      await this.refresh();
    },
    watch: {
      value: async function (needs: Boolean) {
        if (needs) {
          await this.refresh();
        }
      }
    }
  });
</script>

<style scoped>
  .wallet-bar-container {
    z-index: 1;
    position: fixed;
    width: 100%;
    height: 48px;
    margin-top: -4px;
  }
  .wallet-bar-content-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 70%;
    max-width: 300px;
    height: 100%;
  }

  .wallet-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
  }

  .wallet-name {
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 50%;
  }

  .wallet-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 32px;
    margin: auto;
    z-index: 2;
  }
</style>
