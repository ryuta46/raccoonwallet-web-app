<template>
  <div>
    <tool-bar back="/lesson/introduction" :title="$t('lesson.level_title')"></tool-bar>

    <v-content app>
      <v-layout column>
        <img class="app-hero-image" src="../../../assets/heroimage_seclesson_small.png" />
        <v-container>
          <v-layout column>
            <v-flex v-for="item in items" :key="item.image">
                <v-card style="margin-bottom: 24px" :to="item.to">
                  <v-layout row style="height: 96px">
                    <img style="width: auto; height: 100%" :src="require('@/assets/' + item.image)" />

                    <v-layout column style="margin-top: 8px; margin-left: 8px">
                      <span class="app-primary-text">{{ item.title }}</span>
                      <span class="app-small-text text--secondary">{{ item.setup }}</span>
                      <span style="margin-top: 8px">{{ item.message }}</span>
                    </v-layout>
                  </v-layout>
                </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-content>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ToolBar from "../../parts/ToolBar.vue";

  export default Vue.extend({
    components: {ToolBar},
    name: "LessonLevel",
    data () {
      return {
        items: [
          {
            image: 'image_lesson_card1.png',
            title: this.$t('lesson.level_beginner_title'),
            setup: this.$t('lesson.level_beginner_setup'),
            message: this.$t('lesson.level_beginner_message'),
            to: '/lesson/beginner',
          },
          {
            image: 'image_lesson_card2.png',
            title: this.$t('lesson.level_login_title'),
            setup: this.$t('lesson.level_login_setup'),
            message: this.$t('lesson.level_login_message'),
            to: '/lesson/login',
          },
          {
            image: 'image_lesson_card3.png',
            title: this.$t('lesson.level_user_title'),
            setup: this.$t('lesson.level_user_setup'),
            message: this.$t('lesson.level_user_message'),
            to: '/lesson/user',
          },
        ],
      }
    }
  });
</script>
