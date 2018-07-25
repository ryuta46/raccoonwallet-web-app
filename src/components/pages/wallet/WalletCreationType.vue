<template>
  <div>
    <tool-bar back="/wallet/select" :title="$t('wallet.select')"></tool-bar>

    <v-content app>
      <v-layout column>
        <v-flex>
          <v-card v-for="item in items" :key="item.image" style="margin: 16px;">
            <img :src="require('@/assets/' + item.image)" style="width: 100%; height: 100%; object-fit: contain">
            <v-card-title>
              <v-btn block dark :color="item.color" :to="item.to" >{{item.text}}</v-btn>
            </v-card-title>
          </v-card>
        </v-flex>

      </v-layout>
    </v-content>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";

  export default Vue.extend({
    components: {ToolBar},
    name: "WalletCreationType",

    data () {
      return {
        items: [
          { image: "heroimage_new_card.png", color: "primary", text: "Create New Wallet", to: "/wallet/creation/name"},
          { image: "heroimage_login_card.png", color: "nemBlue", text: "LOGIN", to: "/wallet/login/import"},
        ]
      }
    },
  });
</script>
