<template>
  <div>
    <tool-bar back="/wallet/login/import" :title="$t('wallet.login_name_title')"></tool-bar>

    <v-content app>
      <img src="../../../assets/heroimage_login_large.png" style="width: 100%">
      <v-layout raw wrap>
        <v-flex xs10 offset-xs1>
          <p class="text-xs-center">
            <span v-for="sentence in $t('wallet.login_name_message')">{{ sentence }}<br></span>
          </p>
        </v-flex>

        <v-flex xs8 offset-xs2>
          <v-layout row align-center>
            <v-text-field
              id="name"
              name="name"
              v-model="name"
              label="Wallet name"
            ></v-text-field>
          </v-layout>
        </v-flex>
        <v-flex xs12 justify-center>
          <v-layout column align-center>
            <v-btn color="primary" :disabled="prohibited()" @click="onClickedOk">OK</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import {WalletsHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {ToolBar},
    name: "WalletLoginImport",

    data() {
      return {
        name: ""
      }
    },
    methods: {
      prohibited () {
        return this.name.length == 0;
      },

      async onClickedOk () {
        const wallets = await WalletsHelper.gets();
        const id = wallets[wallets.length-1].id;
        await WalletsHelper.setName(id, this.name);

        this.$router.push('/wallet/login/end');
      }
    }
  });
</script>


<style scoped>

</style>
