<template>
  <div>
    <tool-bar back="/top?tab=home" :title="$t('donation.title')"></tool-bar>
    <v-content app style="min-height: 100vh">
      <wallet-bar :is-opened="false"></wallet-bar>

      <v-container>
        <v-layout column style="margin-top: 24px">
          <v-card to="/donation/detail?target=android">
            <v-layout column align-center style="margin-top: 8px">
              <img width="72" src="../../../assets/icon_yuki.png">
              <span class="app-primary-text">Android Developer</span>
              <span class="app-secondary-text">{{$t('common.engineer')}}</span>
            </v-layout>
            <div style="text-align: right">
              <img class="donation-next" width="42" src="../../../assets/icon_box_next.png">
            </div>
          </v-card>

          <v-layout raw style="margin-top: 8px">
            <v-flex>
              <v-card to="/donation/detail?target=rhime">
                <v-layout column align-center style="padding-top: 8px">
                  <img width="72" src="../../../assets/icon_rhime.png">
                  <span class="app-primary-text">Rhime</span>
                  <span class="app-secondary-text">{{'UI' + $t('common.designer')}}</span>
                </v-layout>
                <div style="text-align: right">
                  <img class="donation-next" width="42" src="../../../assets/icon_box_next.png">
                </div>
              </v-card>
            </v-flex>
            <div style="width: 8px;"></div>
            <v-flex>
              <v-card to="/donation/detail?target=ryuta">
                <v-layout column align-center style="padding-top: 8px">
                  <img width="72" src="../../../assets/icon_ryuta.png">
                  <span class="app-primary-text">Ryuta</span>
                  <span class="app-secondary-text">{{'iOS' + $t('common.engineer')}}</span>
                </v-layout>
                <div style="text-align: right">
                  <img class="donation-next" width="42" src="../../../assets/icon_box_next.png">
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>


<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import WalletBar from '../../parts/WalletBar.vue';

  export default Vue.extend({
    components: {ToolBar, WalletBar},
    name: "DonationTop"
  });
</script>
<style scoped>
  .donation-next {
    margin-top: -8px;
    margin-bottom: -10px;
    margin-right: -4px;
  }
</style>
