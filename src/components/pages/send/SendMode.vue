<template>
  <div>
    <tool-bar back="/send/amount" :title="$t('send.mode_select_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

        <v-container>
          <v-layout column>
            <p class="app-large-text" style="text-align: center">{{ $t('send.mode_select_message') }}</p>
            <v-flex v-for="item in items" :key="item.image">
              <v-card style="margin-bottom: 24px" ripple @click.native="goNext(item.to)">
                <v-layout row style="height: 96px">
                  <img style="width: 56px; height: 100%" :src="require('@/assets/' + item.image)" />
                  <v-layout column style="margin-top: 8px; margin-left: 8px">
                    <span class="app-primary-text" style="margin-bottom: 8px">{{ item.title }}</span>
                    <span class="app-x-small-text text--secondary">{{ item.hint }}</span>
                    <span class="app-small-text" style="margin-top: 8px">{{ item.message }}</span>
                  </v-layout>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";
  import 'vue-i18n';

  export default Vue.extend({
    components: {
      ToolBar,
      WalletBar},
    name: "SendMode",
    data () {
      return {
        items: [
          {
            image: 'image_send_card1.png',
            title: this.$t('send.standard_title'),
            hint: this.$t('send.standard_hint'),
            message: this.$t('send.standard_message'),
            to: '/send/confirmation',
          },
          {
            image: 'image_send_card2.png',
            title: this.$t('send.message_title'),
            hint: this.$t('send.message_hint'),
            message: this.$t('send.message_message'),
            to: '/send/message',
          },
        ],
      }
    },
    methods: {
      goNext(to: string) {
        this.$store.commit(MUTATION_TYPES.CLEAR_SEND_MESSAGE);
        this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_SEND_CONFIRMATION, this.$router.currentRoute.path);
        this.$router.push(to);
      }
    }
  });
</script>
