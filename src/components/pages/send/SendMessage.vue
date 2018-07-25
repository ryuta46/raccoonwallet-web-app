<template>
  <div>
    <tool-bar back="/send/mode" :title="$t('send.message_type_select_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

        <v-container>
          <v-layout column>
            <v-flex v-for="item in items" :key="item.image">
              <v-card flat tile style="margin-bottom: 36px" @click.native="openMessageDialog(item.encryption)" color="transparent">
                <v-layout row style="height: 96px" align-center>
                  <v-flex xs6>
                    <v-layout column align-center>
                      <img :style="styles.icon" :src="require('@/assets/' + item.image)" />
                      <p class="app-primary-text" style="margin-top: 8px">{{item.title}}</p>
                    </v-layout>
                  </v-flex>
                  <v-flex xs6>
                    <span class="app-small-text">
                      <template v-for="sentence in item.message">{{ sentence }}<br></template>
                    </span>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-content>
    <v-dialog
      v-model="showMessageDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card >
          <v-btn icon @click.native="showMessageDialog = false">
            <img width="100%" src="../../../assets/icon_close.png">
          </v-btn>
          <v-toolbar-title>{{getMessageBytes()}} / 1024</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="completeMessageInput" :disabled="getMessageBytes() >= 1024">
            <img width="100%" src="../../../assets/icon_check_gray.png">
          </v-btn>
        </v-toolbar>
        <v-text-field
          name="message"
          v-model="message"
          :label="$t('common.message_input')"
          multi-line
        ></v-text-field>
      </v-card>
    </v-dialog>
    <message-dialog
      v-model="showNoPublicKeyDialog"
      :title="$t('send.message_no_public_key_title')" :texts="[$t('send.message_no_public_key_message')]" >
    </message-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import Theme from '../../../raccoonTheme';
  import {MUTATION_TYPES} from '../../../lib/mutationTypes'
  import MessageDialog from "../../parts/MessageDialog";
  import ToolBar from "../../parts/ToolBar.vue";

  export default Vue.extend({
    components: {
      ToolBar,
      MessageDialog, WalletBar},
    name: "SendMessage",
    data () {
      return {
        items: [
          {
            image: 'icon_message_standard.png',
            title: this.$t('send.message_standard_title'),
            message: this.$t('send.message_standard_message'),
            encryption: false,
          },
          {
            image: 'icon_message_encryption.png',
            title: this.$t('send.message_encryption_title'),
            message: this.$t('send.message_encryption_message'),
            encryption: true,
          },
        ],
        styles: {
          icon: {
            width: "64px",
            height: "64px",
            borderRadius: "5px",
            border: "2px solid " + Theme.primary,
            padding: "8px",
            marginTop: "8px"
          }
        },
        message: this.$store.state.sendMessage,
        showMessageDialog: false,
        showNoPublicKeyDialog: false,
      }
    },
    methods: {
      openMessageDialog(encryption: boolean) {
        if (encryption && this.$store.state.receiverPublicKey.length === 0) {
          this.showNoPublicKeyDialog = true;
          return;
        }

        this.$store.commit(MUTATION_TYPES.SET_MESSAGE_ENCRYPTION, encryption);
        this.showMessageDialog = true

      },
      getMessageBytes() {
        return encodeURIComponent(this.message).replace(/%../g,"x").length
      },

      completeMessageInput() {
        this.$store.commit(MUTATION_TYPES.SET_SEND_MESSAGE, this.message);
        this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_SEND_CONFIRMATION, this.$router.currentRoute.path);
        this.$router.push('/send/confirmation')
      }
    }
  });
</script>
