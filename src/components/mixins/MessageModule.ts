
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    showError: (text: string) => void
  }
}


export default Vue.extend({
  methods: {
    showError(text: string) {
      (this as any).$toasted.show(text, {position: 'bottom-center', duration: '3000', type: 'error', fullWidth: true});
    }
  }
});

