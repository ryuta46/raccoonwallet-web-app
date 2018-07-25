<template>
  <div>
    <tool-bar back="/wallet/select" :title="$t('wallet.settings_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar v-model="updateWalletBar" :is-opened="true" :id="id" :icon="false"></wallet-bar>
        <img class="app-hero-image-large" src="../../../assets/heroimage_wallet_large2.png">

        <v-layout column align-center style="margin-top: 8px;" >
          <v-progress-circular v-if="walletType.length === 0" indeterminate color="primary"></v-progress-circular>
          <v-flex style="width: 60vw" v-else>
            <v-card>
              <v-layout column>
                <span style="display: block; text-align: center; margin: 8px">NEM/XEM</span>
                <v-divider></v-divider>
                <span style="display: block; text-align: center; margin: 8px;">{{'WalletType: ' + walletType}}</span>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>

        <p style="margin: 8px">{{$t('wallet.settings_general')}}</p>
        <v-list>
          <template v-for="item in items">
            <v-list-tile :key="item.text" ripple @click="item.method">
              <v-list-tile-content>{{item.text}}</v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="secondary">chevron_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
          </template>
        </v-list>
      </v-layout>
    </v-content>

    <v-dialog v-model="renameDialog" max-width="500px">
      <v-card>
        <v-card-title>{{$t('wallet.rename_title')}}</v-card-title>
        <v-card-text>
          <v-text-field v-model="newWalletName" :label="$t('wallet.rename_hint')"></v-text-field>
          <v-layout raw justify-center>
            <v-btn color="primary" @click="rename" :disabled="newWalletName.length === 0">OK</v-btn>
            <v-btn color="secondary" @click="renameDialog = false">CANCEL</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import {getAccountHttp} from "../../../lib/nisUtils";
  import {Address} from "nem-library";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {ToolBar, WalletBar},
    name: "WalletSettings",
    props: {
      id: String
    },
    data () {
      return {
        items: [
          {
            text: this.$t('wallet.settings_detail'),
            method: (this as any).showDetail
          },
          {
            text: this.$t('wallet.settings_address'),
            method: (this as any).showAddress
          },
          {
            text: this.$t('wallet.settings_backup'),
            method: (this as any).backup
          },
          {
            text: this.$t('wallet.settings_rename'),
            method: (this as any).showRenameDialog
          },
          {
            text: this.$t('wallet.settings_delete'),
            method: (this as any).deleteWallet
          },
        ],
        walletType: '',
        renameDialog: false,
        newWalletName: '',
        updateWalletBar: false,
      }
    },
    methods: {
      showDetail(){
        this.$router.push('/wallet/detail?id=' + this.id);
      },
      showAddress(){
        this.$router.push('/wallet/address?id=' + this.id);
      },
      backup() {
        this.$router.push('/wallet/backup_caution?id=' + this.id);
      },
      showRenameDialog() {
        this.newWalletName = '';
        this.renameDialog = true;
      },
      deleteWallet() {
        this.$router.push('/wallet/delete?id=' + this.id);
      },

      async rename() {
        await WalletsHelper.setName(this.id, this.newWalletName);
        this.renameDialog = false;
        this.updateWalletBar = true;
      }
    },

    async mounted() {
      const accountHttp = getAccountHttp();
      const wallet = await WalletsHelper.get(this.id);
      if (wallet === null) {
        return;
      }

      const address = new Address(wallet.address);
      // check the address is newbie
      accountHttp.getFromAddress(address).subscribe(
        accountInfoWithMetaData => {
          if (accountInfoWithMetaData.cosignatories.length > 0) {
            this.walletType = 'Multisig';
          } else {
            this.walletType = 'Standard';
          }
        },
        error => {
          // Error occurs when the account public key is null.
          // This means the account is not multi signature account.
          this.walletType = 'Standard';
        }
      );
    }


  });
</script>

<style scoped>

</style>
