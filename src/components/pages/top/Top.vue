<template>
  <div style="min-height: 100vh">
    <v-toolbar app>
      <v-spacer></v-spacer>
      <v-toolbar-title>Hello NEMber</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="drawer = true">
        <img height="32px" src="../../../assets/icon_nem.png" />
      </v-btn>
    </v-toolbar>

    <navigation-drawer v-model="drawer"></navigation-drawer>
    <v-content app style="min-height: 100vh">
      <wallet-bar :is-opened="false"></wallet-bar>
      <v-tabs-items v-model="displayTab" style="height: 100%">
        <v-tab-item id="qrlab" ><q-r-lab-view></q-r-lab-view></v-tab-item>
        <v-tab-item id="receive" ><receive-view></receive-view></v-tab-item>
        <v-tab-item id="home" ><home-view :needs-update="displayTab === 'home'"></home-view></v-tab-item>
        <v-tab-item id="send" ><send-view></send-view></v-tab-item>
        <v-tab-item id="scan"><scan-view :is-active="displayTab === 'scan'"></scan-view></v-tab-item>
      </v-tabs-items>
    </v-content>

    <v-bottom-nav :active.sync="displayTab" :value="true" app>
      <v-btn class="bottom-nav-button" flat v-for="item in items" color="teal" :key="item.icon" :value="item.to">
        <span>{{item.label}}</span>
        <img height="32px" :src="require('@/assets/' +  item.icon)" />
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from "../../parts/WalletBar.vue";
  import NavigationDrawer from "../../parts/NavigationDrawer.vue";
  import QRLabView from "./QRLab.vue";
  import ReceiveView from "./Receive.vue";
  import HomeView from "./Home.vue";
  import SendView from "./Send.vue";
  import ScanView from "./Scan.vue";

  export default Vue.extend({
    components: {
      WalletBar,
      NavigationDrawer,
      QRLabView,
      ReceiveView,
      HomeView,
      SendView,
      ScanView,
      },
    name: 'Top',
    data () {
      return {
        drawer: false,
        items: [
          {to: 'qrlab', label:'QR Lab', icon: 'icon_home_qr_labo_green.png'},
          {to: 'receive', label:'RECEIVE', icon: 'icon_home_receive_green.png'},
          {to: 'home', label:'HOME', icon: 'icon_home_home_green.png'},
          {to: 'send', label:'SEND', icon: 'icon_home_send_green.png'},
          {to: 'scan', label:'SCAN', icon: 'icon_home_scan_green.png'},
        ],
      }
    },
    computed: {
      displayTab: {
        get: function() {
          return (this as any).tab;
        },
        set: function(newValue: string) {
          this.$router.replace('/top?tab=' + newValue);
        }
      }
    },
    props: {
      tab: {
        type:String,
        default: 'home'
      },
    },
    mounted() {
      if (this.tab.length > 0) {
        this.displayTab = this.tab;
      }
    }
  });
</script>

<style scoped>
  .bottom-nav-button {
    min-width: 1px;
  }
</style>
