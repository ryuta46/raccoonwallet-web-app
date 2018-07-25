<template>
  <div style="background-color: lightgray">
    <v-layout raw wrap>
      <template v-for="(value, index) in values">
        <v-flex xs3 :key="value">
          <v-card v-if="value === ''" style="margin-bottom: 1px; margin-right: 1px" flat tile color="white" >
            <span :style="styles.number"><br></span>
          </v-card>
          <v-card v-else-if="value === '→' && canGo" style="margin-bottom: 1px; margin-right: 1px" flat tile color="orange" :to="to" >
            <span :style="styles.operator">{{value}}</span>
          </v-card>
          <v-card v-else-if="value === '→' && !canGo" style="margin-bottom: 1px; margin-right: 1px" flat tile color="grey" >
            <span :style="styles.operator">{{value}}</span>
          </v-card>
          <v-card v-else-if="index % 4 === 3" style="margin-bottom: 1px" flat tile ripple color="primary" @click.native="onTouched(value)">
            <span :style="styles.operator"><b>{{value}}</b></span>
          </v-card>
          <v-card v-else style="margin-bottom: 1px; margin-right: 1px" flat tile ripple color="white" @click.native="onTouched(value)">
            <span :style="styles.number"><b>{{value}}</b></span>
          </v-card>
        </v-flex>
      </template>
    </v-layout>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {MUTATION_TYPES} from '../../lib/mutationTypes'

  export default Vue.extend({
    name: "Calculator",
    data () {
      return {
        input: "",
        values: [
          '', '→', 'CE', '=',
          '7', '8', '9', '÷',
          '4', '5', '6', '×',
          '1', '2', '3', '+',
          '.', '0', '⌫', '-',
        ],
        calculated: true,

        styles:
          {
            number: {
              fontSize: 'x-large',
              textAlign: 'center',
              display: 'block',
              padding: '8px',
            },
            operator: {
              fontSize: 'x-large',
              textAlign: 'center',
              display: 'block',
              color: 'white',
              padding: '8px',
            }

          },
        showSuccess: false,
        canGo: true
      }
    },
    props: {
      to: {
        type: String,
        default: ''
      }
    },
    methods: {
      onTouched(value: string) {
        if (this.calculated) {
          this.$store.commit(MUTATION_TYPES.CLEAR_CALCULATOR_FORMULA);
          this.calculated = false
        }

        if (value === 'CE') {
          // clear
          this.$store.commit(MUTATION_TYPES.CLEAR_CALCULATOR_FORMULA);
        } else if (value === '=') {
          // calculate formula
          const formula = this.$store.state.calculatorFormula.split('×').join('*').split('÷').join('/');

          try {
            const value = eval(formula);
            this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_FORMULA, value.toString());

            // to clear on next tap
            this.calculated = true;
          } catch {
          }
        } else if (value === '⌫') {
          // back space
          this.$store.commit(MUTATION_TYPES.DROP_CALCULATOR_FORMULA);

        } else {
          // append to formula
          this.$store.commit(MUTATION_TYPES.APPEND_CALCULATOR_FORMULA, value);
        }

        const calculated = Number(this.$store.state.calculatorFormula);
        if (isFinite(calculated)) {
          this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_VALUE, calculated);
          this.canGo = true
        } else {
          this.canGo = false
        }
      }
    },
    mounted () {
      this.$store.commit(MUTATION_TYPES.CLEAR_CALCULATOR_FORMULA);
      this.$store.commit(MUTATION_TYPES.SET_CALCULATOR_VALUE, 0);
    }
  });
</script>

<style scoped>

</style>
