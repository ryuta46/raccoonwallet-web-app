<template>
  <div style="height: 100vh">
    <tool-bar :back="$store.state.backPathFromSendConfirmation" :title="$t('send.confirmation_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <wallet-bar :is-opened="false"></wallet-bar>
        <img class="app-hero-image" src="../../../assets/heroimage_send_small.png" />

        <v-container>
          <v-layout column>
            <p class="app-primary-text">{{ $t('common.amount') }}</p>
            <template v-for="(value, name) in $store.state.sendMosaics" :id="name" >
              <v-layout :key="name" row width="100%">
                <v-flex xs12>
                  <p class="app-large-text">{{value.amount}} {{name === 'nem:xem' ? 'XEM' : name}} </p>
                </v-flex>
              </v-layout>
            </template>
            <p class="app-primary-text">{{ $t('common.fee') }}</p>
            <p>{{ calculateFee() }} </p>

            <p class="app-primary-text">{{ $t('common.destination') }}</p>
            <p style="word-break: break-all">{{ $store.state.receiverAddress }} </p>

            <template v-if="$store.state.sendMessage.length > 0">
              <p class="app-primary-text">{{ $t('common.message') }}</p>
              <p>{{ $store.state.sendMessage }} </p>
            </template>

          </v-layout>

        </v-container>
      </v-layout>
    </v-content>
    <message-dialog v-model="showSendCaution"
                  :title="$t('send.confirmation_title')"
                  :texts="[$t('send.confirmation_dialog_message')]">
                  </message-dialog>

    <div class="app-bottom-fix" :style="'max-width: 480px'">
      <v-toolbar align-center>
        <v-layout row justify-center align-center>
          <span>{{$t('send.confirmation_ready')}}</span>
          <v-btn fab color="white" small @click="showPinDialog = true"><img width="100%" src="../../../assets/icon_pin_small.png"></v-btn>
          <span>{{$t('send.confirmation_pin')}}</span>
        </v-layout>
      </v-toolbar>
      <div :style="styles.bottomBorder"></div>
      <pin-dialog v-model="showPinDialog" mode="check" @pass="onPassed"></pin-dialog>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WalletBar from '../../parts/WalletBar.vue';
  import MessageDialog from '../../parts/MessageDialog.vue';
  import PinDialog from "../../parts/PinDialog.vue";
  import Theme from '../../../raccoonTheme';
  import {
    Account,
    Address,
    EmptyMessage,
    Message,
    MosaicTransferable,
    PlainMessage,
    PublicAccount,
    TimeWindow,
    TransferTransaction,
    XEM
  } from "nem-library";
  import {getDivided} from "../../../lib/numberUtils";
  import {getTransactionHttp} from "../../../lib/nisUtils";
  import ToolBar from "../../parts/ToolBar.vue";
  import {WalletsHelper} from "../../../lib/storage";
  import MessageModule from "../../mixins/MessageModule";

  export default Vue.extend({
    mixins: [MessageModule],
    components: {
      ToolBar,
      WalletBar, MessageDialog, PinDialog},
    name: "SendConfirmation",
    data () {
      return {
        showSendCaution: true,
        sheet: true,
        styles: {
          bottomBorder: {
            width: '100%',
            height: '4px',
            backgroundColor: Theme.primary
          }
        },
        showPinDialog: false,
        progress: true
      }
    },

    methods: {
      calculateFee (): number {
        try {
          const transaction = this.createTransaction();
          return getDivided( Math.round(transaction.fee), 6).toNumber();
        } catch(error) {
          return 0
        }
      },

      createTransaction(account: Account | null = null): TransferTransaction {
        const xemName = new XEM(0).mosaicId.description();

        let message: Message;

        const receiver = new Address(this.$store.state.receiverAddress);
        if (account == null) {
          account = Account.generateAccount('TEMP', 'TEMPORARY_PHRASE', receiver.network());
        }

        if (this.$store.state.sendMessage.length == 0) {
          message = EmptyMessage;
        } else if (this.$store.state.usesMessageEncryption){
          message = account.encryptMessage(this.$store.state.sendMessage, PublicAccount.createWithPublicKey(this.$store.state.receiverPublicKey));
        } else {
          message = PlainMessage.create(this.$store.state.sendMessage);
        }


        if (Object.keys(this.$store.state.sendMosaics).length == 1 && xemName in this.$store.state.sendMosaics) {
          // XEM transfer
          return TransferTransaction.create(
            TimeWindow.createWithDeadline(),
            receiver,
            new XEM(this.$store.state.sendMosaics[xemName].amount),
            message
          );
        } else {
          // Mosaic transfer
          let mosaics: MosaicTransferable[] = [];
          for (let key in this.$store.state.sendMosaics) {
            const mosaicInfo = this.$store.state.sendMosaics[key];
            mosaics.push(mosaicInfo);
          }
          return TransferTransaction.createWithMosaics(
            TimeWindow.createWithDeadline(),
            receiver,
            mosaics,
            message
          );
        }
      },
      async onPassed(pin: string) {

        let account: Account;
        try {
          const activeWallet = await WalletsHelper.getActive();
          if (!activeWallet){
            return;
          }
          const key = await WalletsHelper.decryptKey(activeWallet.id, pin);
          if (key == null) {
            return;
          }
          account = Account.createWithPrivateKey(key);
        } catch (error) {
          this.showError(error.toString());
          return
        }

        const transaction = this.createTransaction(account);
        const signedTransaction = account.signTransaction(transaction);

        const transactionHttp = getTransactionHttp();

        transactionHttp.announceTransaction(signedTransaction).subscribe(
          result => {
            if ((result.code === 1) && (result.type === 1)) {
              this.$router.push('/send/complete');
            } else {
              this.showError(result.message);
            }
          },
          error => {
            this.showError(error.toString());
          }
        );
      }
    }
  });
</script>

