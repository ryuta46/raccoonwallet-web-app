<template>
  <div>
    <tool-bar back="/wallet/login/name" :title="$t('wallet.login_end_title')"></tool-bar>

    <v-content app>
      <img src="../../../assets/heroimage_login_large.png" style="width: 100%">
      <v-layout raw wrap>
        <v-flex xs10 offset-xs1>
          <p class="text-xs-center">
            <span v-for="sentence in $t('wallet.login_end_message')">{{ sentence }}<br></span>
          </p>
        </v-flex>
        <v-flex>
          <v-layout column align-center>
            <v-btn color="primary" @click="goSecurityLesson">{{ $t('common.security_lesson') }}</v-btn>
            <v-btn color="grey" dark @click="goHome">HOME</v-btn>
          </v-layout>
        </v-flex>

      </v-layout>
    </v-content>
    <message-dialog v-model="showCaution1"
                  :title="$t('wallet.go_home_caution1_title')"
                  :texts="[$t('wallet.go_home_caution1_message')]"
                  @close="onOkCaution1"
                  selectable
    ></message-dialog>

    <message-dialog v-model="showCaution2"
                  :title="$t('wallet.go_home_caution2_title')"
                  :texts="[$t('wallet.go_home_caution2_message')]"
                  @close="onOkCaution2"
                  selectable
    ></message-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";
  import MessageDialog from '../../parts/MessageDialog.vue';

  export default Vue.extend({
    components: {ToolBar, MessageDialog},
    name: "WalletLoginEnd",

    data () {
      return {
        showCaution1: false,
        showCaution2: false,
      }

    },

    methods: {
      goSecurityLesson() {
        this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_LESSON, '/wallet/select');
        this.$router.push('/lesson/introduction');
      },
      goHome() {
        this.showCaution1 = true;
      },
      onOkCaution1() {
        this.showCaution2 = true;
      },
      onOkCaution2() {
        this.$router.push('/top?tab=home');
      }
    }
  });
</script>

<style scoped>

</style>
