<template>
  <div>
    <tool-bar back="/transaction/list" :title="$t('transaction.detail_title')"></tool-bar>
    <v-content app>
      <v-layout column>
        <img class="app-hero-image" src="../../../assets/heroimage_transaction_small.png">
        <v-list>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <v-layout raw align-center>
                <span>{{transaction.dateString + ' ' + transaction.timeString}}</span>
                <v-spacer></v-spacer>
                <template v-if="transaction.message.payload">
                  <span>Message</span>
                  <img width="16" height="16" src="../../../assets/icon_check_gray_on.png">
                </template>
                <template v-if="transaction.mosaics.length > 0">
                  <span style="margin-left: 8px">Mosaic</span>
                  <img width="16" height="16" src="../../../assets/icon_check_gray_on.png">
                </template>
              </v-layout>
              <v-layout raw style="margin-top: 8px" align-center>
                <div style="width: 16px; height: 16px">
                  <template v-if="transaction.isReception" >
                    <img width="100%" src="../../../assets/icon_transaction_receive_green.png" />
                  </template>
                  <template v-else>
                    <img width="100%"  src="../../../assets/icon_transaction_receive_red.png">
                  </template>
                </div>
                <div :style="'margin-left: 8px; width: 16px; height: 16px; visibility: ' + (transaction.isReception ? 'visible' : 'hidden')">
                  <template v-if="transaction.isReception" >
                    <img width="100%" src="../../../assets/icon_multisignature_green.png" />
                  </template>
                  <template v-else>
                    <img width="100%" src="../../../assets/icon_multisignature_red.png">
                  </template>
                </div>
                <v-layout raw align-center style="margin-left: 8px">
                  <span v-if="transaction.isReception" class="app-large-text app-primary-text"><b>+</b></span>
                  <span v-else="transaction.isReception" class="app-large-text app-nem-orange-text"><b>-</b></span>
                  <template v-if="transaction.mosaics.length > 0">
                    <span class="app-large-text">{{transaction.mosaics.length === 1 ? '1 mosaic' : (transaction.mosaics.length + ' mosaics')}}</span>
                  </template>
                  <template v-else>
                    <span class="app-large-text">{{transaction.xemAmount.toString() + 'XEM'}}</span>
                  </template>
                  <v-spacer></v-spacer>
                  <img v-if="transaction.isConfirmed" width="16" height="16" src="../../../assets/icon_transaction_check.png">
                  <img v-else width="auto" height="16" src="../../../assets/icon_transaction_unconfirmed.png">
                </v-layout>
              </v-layout>
              <span class="app-small-text app-secondary-text" style="margin-top: 8px">{{transaction.peer}}</span>
            </v-layout>
          </v-card>
          <v-divider></v-divider>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <span class="app-secondary-text">From</span>
              <span class="app-primary-text">{{transaction.senderAddress}}</span>
            </v-layout>
          </v-card>
          <v-divider></v-divider>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <span class="app-secondary-text">To</span>
              <span class="app-primary-text">{{transaction.receiverAddress}}</span>
            </v-layout>
          </v-card>
          <v-divider></v-divider>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <span v-if="transaction.mosaics.length === 0" class="app-secondary-text">{{'Amount: ' + transaction.xemAmount + ' XEM'}} </span>
              <span class="app-secondary-text">{{'Fee: ' + transaction.feeAmount + ' XEM'}} </span>
            </v-layout>
          </v-card>
          <v-divider></v-divider>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <template v-if="transaction.isConfirmed">
                <span class="app-secondary-text">{{'Block: ' + transaction.transaction.getTransactionInfo().height}} </span>
                <span class="app-secondary-text">Hash: </span><span class="app-primary-text" style="word-break: break-all">{{transaction.transaction.getTransactionInfo().hash.data}}</span>
              </template>
              <template v-else>
                <span class="app-secondary-text">Block:</span>
                <span class="app-secondary-text">Hash:</span>
              </template>
            </v-layout>
          </v-card>
          <v-divider></v-divider>

          <template v-if="transaction.mosaics.length > 0">
            <v-card flat tile style="margin: 8px">
              <v-layout column>
                <v-progress-circular v-if="fetchingMosaicDefinitions" indeterminate color="primary"></v-progress-circular>
                <template v-else>
                  <span v-for="mosaicFullName in Object.keys(mosaics).sort()" class="app-secondary-text">{{mosaics[mosaicFullName] + ' ' + mosaicFullName}}</span>
                </template>
              </v-layout>
            </v-card>
            <v-divider></v-divider>
          </template>
          <v-card flat tile style="margin: 8px">
            <v-layout column>
              <span class="app-secondary-text">Message</span>
              <span v-if="transaction.message.payload.length === 0" class="app-secondary-text">no message</span>
              <span v-else-if="transaction.message.isPlain()" class="app-secondary-text">{{transaction.message.plain()}}</span>
              <template v-else-if="transaction.message.isEncrypted()">
                <span v-if="decryptedMessage.length > 0">{{decryptedMessage}}</span>
                <v-progress-circular v-else-if="decrypting" indeterminate color="primary"></v-progress-circular>
                <v-btn v-else color="primary" @click="tryDecryptMessage">{{$t('transaction.message_is_encrypted')}}</v-btn>
              </template>
            </v-layout>
          </v-card>
        </v-list>
      </v-layout>
    </v-content>
    <pin-dialog v-model="showPinDialog" mode="check" @pass="onPassed"></pin-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  import ToolBar from '../../parts/ToolBar.vue';
  import PinDialog from '../../parts/PinDialog.vue';

  import MessageModule from '../../mixins/MessageModule';
  import TransactionModule from '../../mixins/TransactionModule';
  import {TransactionWrapper} from "../../../lib/transactionWrapper";
  import {PinCodeHelper, WalletsHelper} from "../../../lib/storage";
  import {Account, Address, EncryptedMessage} from "nem-library";
  import {getAccountHttp, getMosaicHttp} from "../../../lib/nisUtils";
  import {getDivided} from "../../../lib/numberUtils";
  import {createMosaicTransferableFrom} from "../../../lib/mosaicUtils";

  const mosaicsType: { [mosaicFullName: string]: number; } = { };
  export default Vue.extend({
    mixins: [MessageModule, TransactionModule],
    components: {ToolBar, PinDialog},
    name: "TransactionDetail",

    data() {
      return {
        decryptedMessage: '',
        showPinDialog: false,
        decrypting: false,
        fetchingMosaicDefinitions: false,
        mosaics: Object.assign({}, mosaicsType)
      }
    },
    computed: {
      transaction() {
        return (this as any).$store.state.transaction;
      }
    },
    methods: {
      async tryDecryptMessage() {
        if (!this.transaction.message.isEncrypted()) {
          return;
        }
        const wallet = await WalletsHelper.getActive();

        if (wallet == null) {
          return;
        }
        if (!await PinCodeHelper.hasSavedCode()) {
          const rawSecret = wallet.decryptSecret(PinCodeHelper.defaultPin);
          if (rawSecret) {
            this.decryptMessage(rawSecret);
          }

        } else {
          this.showPinDialog = true;
        }
      },
      decryptMessage(secret: string) {
        const account = Account.createWithPrivateKey(secret);
        const message: EncryptedMessage = this.transaction.message as EncryptedMessage;

        if (this.transaction.isReception) {
          const senderPublic = this.transaction.senderPublic;
          if (senderPublic == null) {
            this.showError(this.$t('transaction.failed_to_decrypt').toString());
            return;
          }
          this.decryptedMessage = account.decryptMessage(message, senderPublic).payload;
        } else {
          // Get receiver public key
          const accountHttp = getAccountHttp();
          let address: Address;
          try {
            address = new Address(this.transaction.receiverAddress);
          } catch {
            this.showError(this.$t('transaction.failed_to_decrypt').toString());
            return
          }

          this.decrypting = true;
          accountHttp.getFromAddress(address).subscribe(
            accountInfoWithMetaData => {
              if (accountInfoWithMetaData.publicAccount.hasPublicKey()) {
                this.decryptedMessage = account.decryptMessage(message, accountInfoWithMetaData.publicAccount).payload;
              } else {
                this.showError(this.$t('transaction.failed_to_decrypt').toString());
              }
              this.decrypting = false;
            },
            error => {
              this.showError(this.$t('transaction.failed_to_decrypt').toString());
              this.decrypting = false;
            }
          );

        }
      },
      async onPassed(pin: string) {
        const wallet = await WalletsHelper.getActive();
        if (wallet == null) {
          return;
        }
        const secret = await WalletsHelper.decryptKey(wallet.id, pin);
        if (secret == null) {
          this.showError(this.$t('transaction.failed_to_decrypt').toString());
          return;
        }
        this.decryptMessage(secret);
      }
    },
    mounted() {
      // Fail safe
      if (this.transaction === null || !(this.transaction instanceof TransactionWrapper)) {
        this.$router.replace('/transaction/list')
      }

      // fetch mosaic
      this.fetchingMosaicDefinitions = true;
      const mosaicHttp = getMosaicHttp();
      for(let mosaic of this.transaction.mosaics) {
        if (mosaic.mosaicId.name === "xem" && mosaic.mosaicId.namespaceId === "nem") {
          this.mosaics[mosaic.mosaicId.description()] = getDivided( mosaic.quantity, 6).toNumber();
        } else {
          mosaicHttp.getMosaicDefinition(mosaic.mosaicId).subscribe(
            mosaicDefinition => {
              const mosaicTransferable = createMosaicTransferableFrom(mosaicDefinition, mosaic.quantity);
              this.mosaics[mosaicTransferable.mosaicId.description()] = mosaicTransferable.amount;

              if (Object.keys(this.mosaics).length >= this.transaction.mosaics.length) {
                this.fetchingMosaicDefinitions = false;
              }
            },
            error => {
            }
          );
        }
      }

    }
  });
</script>
