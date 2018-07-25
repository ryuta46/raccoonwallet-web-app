<template>
  <v-layout column>
    <img class="app-hero-image-large" src="../../../assets/heroimage_send_large.png" />

    <v-container fluid>
      <v-layout column align-center>
        <p style="font-size: large">{{ $t('send.destination') }}</p>
        <v-card width="100%">
          <v-layout rows align-baseline>
            <v-flex xs9 offset-xs1>
              <v-text-field
                id="address"
                name="address"
                v-model="address"
                :label="$t('send.input_address')"
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-btn icon>
                <img height="100%" src="../../../assets/icon_addressbook.png">
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
        <v-flex align-center justify-center>
          <v-btn color="primary" @click="onClickedOk" :disabled="address.length === 0">OK</v-btn>
        </v-flex>
      </v-layout>
      <message-dialog v-model="showNewbieCaution"
                    :title="$t('send.newbie_caution_title')"
                    :texts="[$t('send.newbie_caution_message')]"
                    @close="onClosedNewbieCaution"></message-dialog>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Address} from "nem-library";
  import MessageDialog from '../../parts/MessageDialog.vue';
  import {MUTATION_TYPES} from '../../../lib/mutationTypes'
  import {getAccountHttp} from "../../../lib/nisUtils";
  import {WalletsHelper} from "../../../lib/storage";
  import MessageModule from "../../mixins/MessageModule";

  export default Vue.extend({
    mixins: [MessageModule],
    components: {MessageDialog},
    name: "SendView",

    data () {
      return {
        address: "",
        showNewbieCaution: false,
      }
    },
    methods: {
      async onClickedOk () {
        if (!(await WalletsHelper.getActive())) {
          this.showError(this.$t('wallet.not_select_message').toString());
          return
        }

        const accountHttp = getAccountHttp();
        let address: Address;
        try {
          address = new Address(this.address);
        } catch {
          this.showError(this.$t('common.invalid_address').toString());
          return
        }

        this.$store.commit(MUTATION_TYPES.SET_RECEIVER_ADDRESS, this.address);

        // check the address is newbie
        accountHttp.getFromAddress(address).subscribe(
          accountInfoWithMetaData => {
            if (accountInfoWithMetaData.publicAccount.hasPublicKey()) {
              // store public key for message encryption
              this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY,accountInfoWithMetaData.publicAccount.publicKey);
            } else {
              this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY,'');
            }

            this.$store.commit(MUTATION_TYPES.CLEAR_SEND_MOSAIC);
            this.$router.push('/send/amount')
          },
          error => {
            this.showNewbieCaution = true
          }
        );

      },
      onClosedNewbieCaution () {
        this.$store.commit(MUTATION_TYPES.CLEAR_SEND_MOSAIC);
        this.$router.push('/send/amount')
      }
    }
  });
</script>

<style scoped>

</style>
