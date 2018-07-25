<template>
  <div style="min-height: 100vh">
    <tool-bar back="/lesson/level" :title="$t('common.pin_settings')"></tool-bar>

    <v-content app>
      <img class="app-hero-image-large" src="../../../assets/heroimage_seclesson_large.png">
      <v-layout raw wrap style="margin-bottom: 40px">
        <v-flex xs10 offset-xs1>
          <p class="text-xs-center">
            <span v-for="sentence in $t('lesson.login_message')">{{ sentence }}<br></span>
          </p>
        </v-flex>
      </v-layout>

      <v-layout class="app-bottom-container" column align-center>
        <v-btn color="primary" small @click="onClickedPinSettings">{{$t('common.pin_settings')}}</v-btn>
      </v-layout>
      <message-dialog v-model="showEncryptedAlready"
                    :title="$t('lesson.cancel_pin_title')"
                    :texts="$t('lesson.cancel_pin_message')"
                    @close="onClosedEncryptedAlready"></message-dialog>
    </v-content>
    <pin-dialog v-model="showPinDialog" mode="register" @pass="onCompletedPinRegistration"></pin-dialog>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import MessageDialog from '../../parts/MessageDialog.vue';
  import PinDialog from '../../parts/PinDialog.vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import {PinCodeHelper} from "../../../lib/storage";

  export default Vue.extend({
    components: {
      ToolBar,
      MessageDialog,
      PinDialog,
    },
    name: "LessonLogin",
    data () {
      return {
        showEncryptedAlready: false,
        showPinDialog: false,
      }
    },

    methods: {
      async onClickedPinSettings() {
        if (await PinCodeHelper.hasSavedCode()) {
          this.showEncryptedAlready = true
        } else {
          this.showPinDialog = true;
        }
      },
      onClosedEncryptedAlready() {
        this.$router.push('/lesson/login_end');
      },
      onCompletedPinRegistration() {
        this.$router.push('/lesson/login_end');
      }
    }
  });
</script>

<style scoped>

</style>
