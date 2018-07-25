<template>
  <v-navigation-drawer v-model="visible" dark absolute>
    <v-list >
      <v-card flat tile>
        <div class="drawer-header-container">
          <img width="100%" src="../../assets/image_menu_default.png"  />
          <div class="drawer-header-contents">
            <div class="drawer-header-contents-container">
              <img width="72px" src="../../assets/logo_pyoko.png" />
              <div style="margin-left: 8px">
                <span class="app-x-large-text">{{walletName}}</span><br>
                <span>{{walletAddress}}</span>
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <v-list-tile v-for="item in items" :key="item.title" @click="item.action">
        <template v-if="item.title.length > 0">
          <v-list-tile-action>
            <img width="24px" :src="require('@/assets/' + item.icon)"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </template>
        <template v-else>
          <v-divider></v-divider>
        </template>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {WalletsHelper} from "../../lib/storage";
  import MessageModule from '../mixins/MessageModule'

  export default Vue.extend({
    mixins: [MessageModule],
    name: "NavigationDrawer",

    props: {
      value: {
        type: Boolean,
        default: true
      },
    },
    data () {
      return {
        visible: (this as any).value,
        items: [
          { title: 'Home', icon: 'icon_menu_home.png', action: (this as any).closeDrawer},
          { title: this.$t('common.address_book'), icon: 'icon_menu_addressbook.png', action: (this as any).showNotImplementedYet },
          { title: this.$t('common.mosaic_gallery'), icon: 'icon_menu_mosaic.png' , action: (this as any).goToMosaicGallery },
          { title: this.$t('common.donation'), icon: 'icon_menu_faucet.png' , action: (this as any).goToDonation },
          { title: '', icon:'' , action: (this as any).showNotImplementedYet },
          { title: 'About', icon: 'icon_menu_about.png' , action: (this as any).goToAboutThisApp },
          { title: 'Help', icon: 'icon_menu_help.png' , action: (this as any).jumpToHelp },
          { title: this.$t('common.settings'), icon: 'icon_menu_setting.png' , action: (this as any).goToSettings },
        ],
        right: null,
        walletName: '',
        walletAddress: ''
      }
    },
    methods: {
      closeDrawer() {
        this.visible = false;
      },

      showNotImplementedYet() {
        this.showError(this.$t('common.coming_soon').toString());
      },

      goToMosaicGallery() {
        this.$router.push('/gallery')
      },

      goToDonation() {
        this.$router.push('/donation/top')
      },


      jumpToHelp() {
        window.open('https://raccoonwallet.com/help/')
      },

      goToAboutThisApp() {
        this.$router.push('/about')
      },

      goToSettings() {
        this.$router.push('/settings/top')
      }
    },
    async mounted() {
      const wallet = await WalletsHelper.getActive();
      if (wallet === null) {
        this.walletName = this.$t('common.not_select').toString();
        this.walletAddress = ''
      }
      else {
        this.walletName = wallet.name;
        this.walletAddress = wallet.address;
      }
    },
    watch: {
      visible() {
        this.$emit('input', this.$data.visible);
      },
      value() {
        this.visible = this.value
      }
    }
  });
</script>

<style scoped>
  .drawer-header-container {
    position: relative
  }

  .drawer-header-contents {
    position: absolute;
    top: 50%;
    left: 16px;
    -ms-transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    margin:0;
    padding:0;
  }

  .drawer-header-contents-container {
    display: flex;
    align-items: center;
  }


</style>
