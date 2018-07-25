<template>
  <v-layout column>
    <img class="app-hero-image" src="../../../assets/heroimage_qr_labo_small.png" />

    <v-container>
      <v-layout column>
        <v-flex v-for="item in smallItems" :key="item.icon">
          <div class="card-container">
            <v-card @click.native="onTouchedCard(item.to)" ripple>
              <v-layout row wrap>
                <v-flex xs2>
                  <div :style="iconBackgroundStyle">
                    <v-card-media :src="require('@/assets/' + item.icon)" contain height="100%" >
                    </v-card-media>
                  </div>
                </v-flex>
                <v-flex xs10>
                  <v-card-text><span v-html="item.text"></span></v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </div>
        </v-flex>
        <v-flex>
          <div class="card-container">
            <v-card>
              <v-layout row wrap>
                <v-flex xs4>
                  <div :style="iconBackgroundStyle">
                    <v-card-media :src="require('@/assets/icon_register_84px.png')" contain height="100%" >
                    </v-card-media>
                  </div>
                </v-flex>
                <v-flex xs8>
                  <v-card-text>
                    <p style="font-size: large">{{ $t('qrlab.register_name') }}</p>
                    <p style="font-size: small">{{ $t('qrlab.register_description') }}</p>
                    <p>{{ $t('common.coming_soon') }}</p>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Theme from '../../../raccoonTheme'
  import MessageModule from "../../mixins/MessageModule";
  export default Vue.extend({
    mixins: [MessageModule],
    name: "QRLabView",

    data () {
      return {
        smallItems: [
          { icon: 'icon_dentaku.png',  text: this.$t('qrlab.calculator_description'), to: '/qrlab/amount'},
          { icon: 'icon_list.png', text: this.$t('qrlab.list_description'), to: ''},
        ],
        iconBackgroundStyle: {
          background: Theme.primary,
          padding: "8px",
          height: "100%",
        }
      }
    },

    methods: {
      onTouchedCard(to: string) {
        if (to.length === 0) {
          this.showError(this.$t('common.coming_soon').toString());
        } else{
          this.$router.push(to)
        }
      }
    }
  });
</script>

<style scoped>
  .card-container {
    margin-bottom: 16px;
  }
</style>
