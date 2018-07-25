<template>
  <div style="min-height: 100vh">
    <tool-bar back="/lesson/level" :title="$t('lesson.beginner_title')"></tool-bar>

    <v-content app>
      <img class="app-hero-image-large" src="../../../assets/heroimage_seclesson_large.png">
      <v-layout raw wrap style="margin-bottom: 40px">
        <v-flex xs10 offset-xs1>
          <p class="text-xs-center">
            <span v-for="sentence in $t('lesson.beginner_message')">{{ sentence }}<br></span>
          </p>
        </v-flex>
      </v-layout>

      <v-layout class="app-bottom-container" column align-center>
        <v-btn color="primary" small @click="goKey">OK</v-btn>
      </v-layout>
    </v-content>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";
  import {MUTATION_TYPES} from "../../../lib/mutationTypes";

  export default Vue.extend({
    components: {ToolBar},
    name: "LessonBeginner",
    methods: {
      goKey() {
        this.$store.commit(MUTATION_TYPES.SET_BACK_PATH_FROM_KEY, '/lesson/beginner');
        this.$router.push('/lesson/key/caution')
      }
    }
  });
</script>

<style scoped>

</style>
