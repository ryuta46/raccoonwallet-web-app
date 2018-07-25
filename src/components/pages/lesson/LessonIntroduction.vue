<template>
  <div style="min-height: 100vh">
    <tool-bar :back="$store.state.backPathFromLesson" :title="$t('common.security_lesson')"></tool-bar>
    <v-content app>
      <img class="app-hero-image-large" src="../../../assets/heroimage_seclesson_large.png">
      <v-layout raw wrap style="margin-bottom: 40px">
        <v-flex xs12>
          <p class="text-xs-center">{{ $t('lesson.introduction_message_0') }}<br>{{ $t('lesson.introduction_message_1') }}<br>{{ $t('lesson.introduction_message_2') }}</p>
        </v-flex>

        <v-flex xs12>
          <p class="text-xs-center">{{ $t('lesson.introduction_message_3') }}<br>{{ $t('lesson.introduction_message_4') }}<br>{{ $t('lesson.introduction_message_5') }}</p>
        </v-flex>
      </v-layout>

      <v-layout class="app-bottom-container" column align-center>
        <v-btn color="primary" small to="/lesson/level">OK</v-btn>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";

  export default Vue.extend({
    components: {ToolBar},
    name: "LessonIntroduction",
  });
</script>
