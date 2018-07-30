<template>
    <qrcode-reader v-if="isActive" @init="onInit" @decode="onDecode"></qrcode-reader>
</template>

<script lang="ts">
  import Vue from 'vue'
  import MessageModule from '../../mixins/MessageModule'
  import {InvoiceData} from "../../../lib/invoiceData";
  import {getAccountHttp} from "../../../lib/nisUtils";
  import {Address, XEM} from "nem-library";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";
  import {getDivided} from "../../../lib/numberUtils";

  export default Vue.extend({
    mixins: [MessageModule],
    name: "ScanView",

    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      async onInit (promise: any) {
        // show loading indicator
        try {
          await promise
          // successfully initialized
        } catch (error) {
          let message = 'Unknown';
          if (error.name === 'NotAllowedError') {
            // user denied camera access permisson
            message = 'Not Allowed';
          } else if (error.name === 'NotFoundError') {
            // no suitable camera device installed
            message = 'Not Found';
          } else if (error.name === 'NotSupportedError') {
            // page is not served over HTTPS (or localhost)
            message = 'Not Supported';
          } else if (error.name === 'NotReadableError') {
            // maybe camera is already in use
            message = 'Not Readable';
          } else if (error.name === 'OverconstrainedError') {
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
            message = 'Over Constrained';
          } else {
            // browser is probably lacking features (WebRTC, Canvas)
            message = 'Unknown'
          }
          this.showError('Camera is not available: ' + message);
        } finally {
          // hide loading indicator
        }
      },
      onDecode(decodedString: string) {
        const invoiceData = InvoiceData.fromJsonString(decodedString);
        if (invoiceData) {
          const accountHttp = getAccountHttp();
          let address = new Address(invoiceData.address);

          this.$store.commit(MUTATION_TYPES.SET_RECEIVER_ADDRESS, invoiceData.address);
          this.$store.commit(MUTATION_TYPES.CLEAR_SEND_MOSAIC);
          this.$store.commit(MUTATION_TYPES.ADD_SEND_MOSAIC, new XEM(getDivided(invoiceData.amount, 6).toNumber()));
          this.$store.commit(MUTATION_TYPES.SET_MESSAGE_ENCRYPTION, false);
          this.$store.commit(MUTATION_TYPES.SET_SEND_MESSAGE, invoiceData.message);

          accountHttp.getFromAddress(address).subscribe(
            accountInfoWithMetaData => {
              if (accountInfoWithMetaData.publicAccount.hasPublicKey()) {
                // store public key for message encryption
                this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY, accountInfoWithMetaData.publicAccount.publicKey);
              } else {
                this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY, '');
              }
              this.$router.push('/send/confirmation')
            },
            error => {
              this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY, '');
              this.$router.push('/send/confirmation')
            }
          );
        }
      }
    },
  });
</script>

