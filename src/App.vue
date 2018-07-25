<template>
  <v-app ref="container">
    <div ref="content">
      <transition :name="transition">
        <router-view></router-view>
      </transition>
    </div>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Route} from "vue-router";


  export default Vue.extend({
    name: 'app',
    data () {
      return {
        allowUp: true,
        allowDown: true,
        slideBeginY: 0,
        transition: ''
      }

    },
    watch: {
      '$route' (toRoute: Route, fromRoute: Route) {
        // exceptions
        // /top <=> /send/*  => no transition
        const exceptions = [
          ['/top', '/send'],
          ['/top', '/transaction/list'],
          ['/wallet', '/lesson'],
        ];

        for (let pair of exceptions) {
          if ((fromRoute.path.startsWith(pair[0]) && toRoute.path.startsWith(pair[1])) ||
            (fromRoute.path.startsWith(pair[1]) && toRoute.path.startsWith(pair[0]))) {
            this.transition = '';
            return;
          }
        }

        function getVirtualPosition(path: string) {
          const virtualGrid = [
            ['/wallet/select'],
            ['/wallet/creation/type', '/wallet/creation/name', '/wallet/creation/new', '/wallet/creation/end', '/wallet/login/import', '/wallet/login/name', '/wallet/login/end'],
            ['/wallet/settings', '/wallet/detail', '/wallet/rename', '/wallet/address', '/wallet/delete'],
            ['/lesson/introduction', '/lesson/level', '/lesson/beginner', '/lesson/login', '/lesson/user', '/lesson/key/caution','/lesson/key', '/lesson/beginner_backup_end', '/lesson/beginner_end', '/lesson/login_end' ],
            ['/send/amount', '/send/mode', '/send/message', '/send/confirmation', '/send/complete'],
            ['/top'],
            ['/transaction/list', '/transaction/detail'],
          ];
          for (let y=0; y < virtualGrid.length; ++y) {
            for (let x=0; x < virtualGrid[y].length; ++x) {
              if (virtualGrid[y][x] === path) {
                return [x, y];
              }
            }
          }
          return [-1, -1];
        }

        const fromPosition = getVirtualPosition(fromRoute.path);
        const toPosition = getVirtualPosition(toRoute.path);

        // no virtual position => no transition
        if (fromPosition[0] < 0 || fromPosition[1] < 0 || toPosition[0] < 0 || toPosition[1] < 0) {
          this.transition = '';
          return;
        }


        if (fromPosition[1] > toPosition[1]) {
          this.transition = 'slide-down'
        } else if (fromPosition[1] < toPosition[1]) {
          this.transition = 'slide-up';
        } else {
          if (fromPosition[0] < toPosition[0]) {
            this.transition = 'fade-left'
          } else if (fromPosition[0] > toPosition[0]) {
            this.transition = 'fade-right'
          } else {
            this.transition = '';
          }
        }
      }
    }
  });
</script>

<style lang="stylus">
  @import './stylus/main'

  .slide-up-enter-active, .slide-up-leave-active  {
    position: fixed;
    transition: all .3s ease;
  }
  .slide-up-enter {
    position: fixed;
    transform: translateY(100vh);
  }
  .slide-up-leave-to {
    position: fixed;
    transform: translateY(-100vh);
  }

  .slide-down-enter-active, .slide-down-leave-active  {
    position: fixed;
    transition: all .3s ease;
  }
  .slide-down-enter {
    position: fixed;
    transform: translateY(-100vh);
  }
  .slide-down-leave-to {
    position: fixed;
    transform: translateY(100vh);
  }

  .fade-left-enter-active, .fade-left-leave-active  {
    position: fixed;
    transition: all .3s ease;
  }
  .fade-left-enter {
    position: fixed;
    transform: translateX(50vw);
    opacity : 0
  }
  .fade-left-leave-to {
    position: fixed;
    transform: translateX(-50vw);
    opacity : 0
  }

  .fade-right-enter-active, .fade-right-leave-active  {
    position: fixed;
    transition: all .3s ease;
  }
  .fade-right-enter {
    position: fixed;
    transform: translateX(-50vw);
    opacity : 0
  }
  .fade-right-leave-to {
    position: fixed;
    transform: translateX(50vw);
    opacity : 0
  }


</style>
