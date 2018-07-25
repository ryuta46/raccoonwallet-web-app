// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'

import "vuetify/dist/vuetify.min.css";
import "material-design-icons/iconfont/material-icons.css";
import Theme from './raccoonTheme';
import * as messages from './messages.json';

import {NEMLibrary, NetworkTypes} from "nem-library";
import store from "./lib/store";
import {Storage} from "./lib/storage";
import { sync } from 'vuex-router-sync'
import Toasted from 'vue-toasted';
import {Environment} from './lib/environment';
import {MUTATION_TYPES} from "./lib/mutationTypes";
import VueQrcodeReader from 'vue-qrcode-reader'

Storage.setup();

//NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'ja',
  messages: messages
});

Vue.use(Vuetify, {
  theme: Theme
});

Vue.use(Toasted);
Vue.use(VueQrcodeReader);

// Retrieves initial root from localStorage.
let initialRoot = null;

// If iOS Standalone mode, sync router to vuex and localStorage
if (Environment.isIos() && Environment.isInStandaloneMode()) {
  initialRoot = store.state.route != null ? store.state.route.fullPath : '/top';
  const unsync = sync(store, router);
}

// setup types of retrieved data
store.commit(MUTATION_TYPES.SETUP_TYPES);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  created () {
    if (initialRoot) {
      this.$router.replace(initialRoot);
    }
  },
  methods: {
    onChangedLanguage(lang) {
      this.$i18n.locale = lang;
    }
  },
  template: '<App/>'
});

