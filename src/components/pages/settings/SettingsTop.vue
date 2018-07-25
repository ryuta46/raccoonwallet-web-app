<template>
  <div>
    <tool-bar back="/top?tab=home" :title="$t('common.settings')"></tool-bar>

    <v-content app>
      <img class="app-hero-image-large" src="../../../assets/heroimage_setting_large.png" />

      <v-layout column>
        <p class="app-large-text" style="margin: 12px">{{$t('common.general')}}</p>
        <v-list>
          <v-list-tile @click="showNotImplementedYet">
            <v-list-tile-content>
              <span >{{$t('settings.language_select')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_list_next.png"/>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile @click="showNotImplementedYet">
            <v-list-tile-content>
              <span >{{$t('settings.notification_settings')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_list_next.png"/>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <p class="app-large-text" style="margin: 12px">{{$t('common.security')}}</p>
        <v-list>
          <v-list-tile @click="changePassword">
            <v-list-tile-content>
              <span >{{$t('settings.change_password')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_list_next.png"/>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile @click="goToSecurityLesson">
            <v-list-tile-content>
              <span >{{$t('settings.go_to_security_lesson')}}</span>
            </v-list-tile-content>
            <v-list-tile-action>
              <img width="24px" src="../../../assets/icon_list_next.png"/>
            </v-list-tile-action>
          </v-list-tile>

        </v-list>
      </v-layout>

    </v-content>
    <pin-dialog v-model="showPinDialog" mode="change"></pin-dialog>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue';
  import PinDialog from '../../parts/PinDialog.vue';
  import MessageModule from '../../mixins/MessageModule';
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";

  export default Vue.extend({
    mixins: [MessageModule],
    components: { ToolBar, PinDialog },
    name: "SettingsTop",
    data () {
      return {
        showPinDialog: false,
      }
    },

    methods: {
      showNotImplementedYet() {
        this.showError(this.$t('common.coming_soon').toString());
      },

      changePassword() {
        this.showPinDialog = true;
      },

      goToSecurityLesson() {
        this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_LESSON, '/settings/top');
        this.$router.push('/lesson/introduction');
      },
    }
  });
</script>

<style scoped>

</style>
