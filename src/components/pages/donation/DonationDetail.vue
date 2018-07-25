<template>
  <div>
    <tool-bar back="/donation/top" :title="$t('donation.detail_title')"></tool-bar>
    <v-content app style="min-height: 100vh">
      <v-container>
        <v-card>
          <v-layout column align-center style="padding-top: 8px">
            <img width="72" :src="require('../../../assets/' + targetIcon)">
            <span class="app-primary-text">{{targetName}}</span>
            <span class="app-secondary-text">{{targetJob}}</span>
          </v-layout>

          <v-card-text>
          <span v-for="sentence in targetDetail">{{ sentence }}<br></span>
          </v-card-text>
          <v-layout align-center justify-center>
            <v-btn color="primary" @click="donate">DONATE</v-btn>
          </v-layout>
        </v-card>
      </v-container>
    </v-content>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from '../../parts/ToolBar.vue'
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";

  export default Vue.extend({
    components: {ToolBar},
    name: "DonationDetail",

    props: {
      target: {
        type: String,
        default: ''
      }
    },
    computed: {
      targetName(): string {
        return this.$data[this.target].name;
      },
      targetIcon(): string {
        return this.$data[this.target].icon;
      },
      targetJob(): string {
        return this.$data[this.target].job;
      },
      targetDetail(): string {
        return this.$data[this.target].detail;
      },
      targetAddress(): string {
        return this.$data[this.target].address;
      },
      targetPublicKey(): string {
        return this.$data[this.target].publicKey;
      },
    },
    data() {
      return {
        android: {
          name: 'Android Developer',
          icon: 'icon_yuki.png',
          job: this.$t('common.engineer'),
          detail: this.$t('donation.android_developer_detail'),
          address: 'NBHF3BSD4OHRIXHIERML27LHABVKK2MVK36YOYUN',
          publicKey: 'b5ffa10aca9ac7abbf6517195d9a7eae2cdcb3b9f286ce11837d0d8ecc9669b2'
        },
        rhime: {
          name: 'Rhime',
          icon: 'icon_rhime.png',
          job: 'UI' + this.$t('common.designer'),
          detail: this.$t('donation.rhime_detail'),
          address: 'NA4JR3MMBGS2P5U6WD7WVKYE5IHJZYICDDUL3IQI',
          publicKey: '2d781927ab153e2fb4d23284ac3d63a46aa4acea4f01a34dd6856c5a28280bf5',
        },
        ryuta: {
          name: 'Ryuta',
          icon: 'icon_ryuta.png',
          job: 'iOS' + this.$t('common.engineer'),
          detail: this.$t('donation.ryuta_detail'),
          address: 'NAEZYI6YPR4YIRN4EAWSP3GEYU6ATIXKTXSVBEU5',
          publicKey: 'f687ee0fc27fa664f19c072825e0ccc8e0bf631b704434c977fa6472d7c4980f'
        }
      }
    },
    methods: {
      donate() {
        this.$store.commit(MUTATION_TYPES.SET_RECEIVER_ADDRESS, this.targetAddress);
        this.$store.commit(MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY, this.targetPublicKey);
        this.$store.commit(MUTATION_TYPES.CLEAR_SEND_MOSAIC);
        this.$router.push('/send/amount')
      }
    }
  });
</script>
