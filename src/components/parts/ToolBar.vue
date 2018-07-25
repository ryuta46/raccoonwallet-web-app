<template>
  <v-toolbar app>
    <v-btn icon @click="backTo"><v-icon color="primary">arrow_back</v-icon></v-btn>
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
  import Vue from 'vue';
  import {Environment} from "../../lib/environment";

  export default Vue.extend({
    name: "ToolBar",
    props: {
      back: '',
      title: ''
    },
    methods: {
      backTo() {
        if (Environment.isIos() && Environment.isInStandaloneMode()) {
          this.$router.push(this.back);
        } else {
          this.$router.go(-1);
        }
      }
    }
  });
</script>
