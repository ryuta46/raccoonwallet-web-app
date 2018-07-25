<template>
  <div>
    <tool-bar :back="'/wallet/settings?id=' + id" :title="$t('wallet.detail_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="true" :id="id" :icon="false"></wallet-bar>
        <img class="app-hero-image-large" src="../../../assets/heroimage_wallet_large2.png">

        <template v-if="loading">
          <v-layout column align-center>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-layout>
        </template>
        <template v-else>
          <v-layout column align-center style="margin-top: 8px;" >
            <v-flex style="width: 60vw">
              <v-card>
                <v-layout column>
                  <span style="display: block; text-align: center; margin: 8px">NEM/XEM</span>
                  <v-divider></v-divider>
                  <span style="display: block; text-align: center; margin: 8px;">{{'WalletType: ' + walletType}}</span>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>

          <p style="margin: 8px">{{$t('wallet.detail_general')}}</p>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <span class="app-medium-text">{{$t('wallet.detail_structure')}}</span>
              </v-list-tile-content>
              <v-list-tile-action-text>{{walletStructure}}</v-list-tile-action-text>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <span class="app-medium-text">{{$t('wallet.detail_importance')}}</span>
              </v-list-tile-content>
              <v-list-tile-action-text>{{importance}}</v-list-tile-action-text>
            </v-list-tile>
            <v-divider></v-divider>
            <v-card tile flat>
              <v-card-text>
                <span class="app-medium-text">{{$t('common.public_key')}}</span>
                <br>
                <span style="word-break: break-all">{{publicKey}}</span>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
          </v-list>

        </template>
      </v-layout>

    </v-content>
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
    name: "WalletDetail",
    props: {
      id: String
    },
    data () {
      return {
        loading: true,
        walletType: '',
        walletStructure: '',
        importance: 0,
        publicKey: this.$t('common.not_get'),
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
            //this.walletStructure = `${accountInfoWithMetaData.cosignatoriesCount} of ${accountInfoWithMetaData.cosignatories.length}`;
            // FIXME: multisiginfo is not correct now.
            // https://github.com/aleixmorgadas/nem-library-ts/issues/38
            this.walletStructure = '? of ?'
          } else {
            this.walletType = 'Standard';
            this.walletStructure = '0 of 0';
          }
          this.importance = accountInfoWithMetaData.importance;
          this.publicKey = accountInfoWithMetaData.publicAccount.publicKey;
          this.loading = false;
        },
        error => {
          // Error occurs when the account public key is null.
          // This means the account is not multi signature account.
          this.walletType = 'Standard';
          this.walletStructure = '0 of 0';
          this.importance = 0;
          this.publicKey = this.$t('common.not_get');
          this.loading = false;
        }
      );
    }
  });
</script>

