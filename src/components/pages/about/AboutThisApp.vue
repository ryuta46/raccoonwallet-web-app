<template>
  <div>
    <tool-bar back="/top?tab=home" title="About This APP"></tool-bar>

    <v-content app>
      <v-layout column align-center :style="styles.header">
        <img style="margin-top: 8px" width="25%" src="../../../assets/top_icon.png" />
        <img width="50%" src="../../../assets/top_logotype.png" />

        <p class="text-xs-center" style="color: white; margin-top: 24px" >
          <span v-for="sentence in $t('about.app_concept')">{{ sentence }}<br></span>
        </p>
      </v-layout>

      <v-layout column>
        <p style="margin: 8px">RaccoonWallet</p>
        <v-list>
          <v-list-tile @click="openLink('https://raccoonwallet.com')">
            <v-list-tile-content>
              <span >{{$t('about.official_site')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_link.png"/>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile @click="openLink('https://discord.gg/FrvjRzm')">
            <v-list-tile-content>
              <span >{{$t('about.discord')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_link.png"/>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <!-- <v-list-tile @click="">
            <v-list-tile-content>
              <span >{{$t('about.open_source')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_link.png"/>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          -->
        </v-list>
        <v-card flat tile ripple @click.native="openLink('https://raccoonwallet.com/tos_pp/')">
          <v-card-text>
            <p class="text-xs-center app-primary-text" ><u>{{ $t('common.privacy_policy') }}</u></p>
          </v-card-text>
        </v-card>
      </v-layout>

    </v-content>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import Theme from '../../../raccoonTheme'

  export default Vue.extend({
    components: {ToolBar},
    name: "WalletDetail",
    props: {
      id: String
    },
    data () {
      return {
        loading: true,

        styles: {
          header: {
            backgroundColor: Theme.primary
          }
        }
      }
    },
    methods : {
      openLink(url: string) {
        window.open(url);
      }
    },
  });
</script>

