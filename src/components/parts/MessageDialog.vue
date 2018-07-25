<template>
  <v-dialog v-model="visible" bac>
    <div :style="styles.header">
      <img class="app-center-in-container-transform" height="48px" src="../../assets/logo_pyoko.png">
    </div>
    <v-layout style="background-color: white" raw wrap align-center>
      <v-flex xs12>
        <p :style="styles.title">{{ title }}</p>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <div>
          <v-tabs-items v-model="model">
            <div style="display: flex; flex-direction: column">
            <v-tab-item v-for="(lines, i) in texts" :key="i" :id="`${i}`" >
              <p>
                <span v-for="(line, j) in lines" :key="j" :style="styles.text">{{line}}<br></span>
              </p>
            </v-tab-item>
            </div>
          </v-tabs-items>
          <v-tabs slot="extension" v-model="model" centered hide-slider height="0">
            <v-tab v-for="i in texts.length" :key="i" :href="`#${i-1}`"></v-tab>
          </v-tabs>
        </div>
      </v-flex>
      <v-flex xs12 v-if="texts.length > 1">
        <v-layout justify-center>
          <div @change="model"
               v-for="i in texts.length"
               :key="i"
               :style="getIndicatorStyle(`${i-1}` === model)"
               @click="model = `${i-1}`" >
          </div>
        </v-layout>
      </v-flex>
      <v-flex xs12 style="margin-top: 16px">
        <v-layout justify-center >
          <template v-if="selectable">
            <v-btn color="secondary" flat @click="onClickedNegative">CANCEL</v-btn>
            <v-btn color="primary" flat @click="onClickedPositive">OK</v-btn>
          </template>
          <template v-else>
            <v-btn color="primary" @click="onClickedPositive">OK</v-btn>
          </template>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Theme from '../../raccoonTheme'
  export default Vue.extend({
    name: "MessageDialog",
    props: {
      title: {
        type: String,
        default:''
      },
      texts: {
        type: Array,
        default: []
      },
      value: {
        type: Boolean,
        default: true
      },
      selectable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: "0",
        styles: {
          header: {
            backgroundColor: Theme.primary,
            width: '100%',
            height: '64px',
            position: 'relative'
          },
          title: {
            fontSize: 'large',
            textAlign: 'center'
          },
          text: {
            fontSize: 'small',
            color: Theme.textSlightGray
          },
        },
        visible: (this as any).value
      }
    },
    methods: {
      getIndicatorStyle(isActive: Boolean) {
        let style = {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: Theme.primary,
            display: "inline",
            marginLeft: "8px",
            marginRight: "8px",
        };

        if (isActive) {
          style.backgroundColor = Theme.primary;
        } else{
          style.backgroundColor = Theme.textLightGray;
        }
        return style;
      },
      onClickedNegative() {
        this.$emit('input', false);
        this.$emit('cancel')
      },
      onClickedPositive() {
        this.$emit('input', false);
        this.$emit('close')
      }
    },
    watch: {
      visible() {
        this.$emit('input', this.$data.visible);
      },
      value() {
        this.visible = this.value
      }
    }
  });
</script>

<style scoped>

</style>
