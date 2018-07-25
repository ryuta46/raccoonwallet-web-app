<template>
  <v-dialog
    v-model="value"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <div class="app-match-parent app-primary-background">
      <v-content app style="margin-top: -40px">
        <v-btn icon @click="cancel">
          <img src="../../assets/icon_back.png" width="36px" style="margin: 8px" >
        </v-btn>
        <v-layout column align-center>
          <img src="../../assets/top_icon.png" style="width: 110px; height: auto">
          <p class="white--text" style="margin-top: 8px; font-size: large;"><b>
            <span v-if="state === states.check">Check PIN</span>
            <span v-else-if="state === states.registration">Enter PIN</span>
            <span v-else-if="state === states.confirmation">Confirm PIN</span>
          </b></p>
          <div style="display: flex; margin-bottom: 16px">
            <div v-for="i in 6" :key="i">
              <div :style="'width: 12px; height: 12px; border-radius: 4px; border: 2px solid white; margin-left: 3px; margin-right: 3px;' + (i <= input.length ? 'background-color: white' : '')"></div>
            </div>
          </div>
          <v-flex>
            <div :style="styles.container">
              <div v-for="code in 9" :key="code">
                <v-card :style="styles.inputCard" @click.native="onClickedCode(code)" color="transparent"  ripple flat>
                  <div :style="styles.input">
                    <span class="app-center-in-container-transform white--text app-large-text">{{ code }}</span>
                  </div>
                </v-card>
              </div>

              <v-card :style="styles.inputCard" @click.native="onClickedCode(0)" color="transparent" flat ripple>
                <div :style="styles.input">
                  <span class="app-center-in-container-transform white--text app-large-text">0</span>
                </div>
              </v-card>
            </div>
            <message-dialog v-model="showRegistration" :title="$t('common.pin_settings')" :texts="$t('common.pin_registration_message')"></message-dialog>
            <message-dialog v-model="showSuccess" :title="$t('common.success')" :texts="$t('common.pin_registration_complete')" @close="closeView"></message-dialog>
          </v-flex>
        </v-layout>
      </v-content>
    </div>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import MessageDialog from './MessageDialog.vue';
  import {PinCodeHelper, WalletsHelper} from "../../lib/storage";
  import MessageModule from "../mixins/MessageModule";

  const inputSize = 48;
  const inputHorizontalMargin = 8;
  const inputVerticalMargin = 4;

  export default Vue.extend({
    mixins: [MessageModule],
    components: {
      MessageDialog,
    },
    name: "PinInput",
    props: {
      // "check" or "register"
      mode: {
        type: String,
        default: "check",
      },
      value: {
        type: Boolean,
        default: true
      },
    },

    data () {
      return {
        input: "",
        styles:
          {
            container: {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              width: ((inputSize + inputHorizontalMargin * 2) * 3).toString() + "px"
            },
            inputCard: {
              marginTop: inputVerticalMargin.toString() + "px",
              marginBottom: inputVerticalMargin.toString() + "px",
              marginLeft: inputHorizontalMargin.toString() + "px",
              marginRight: inputHorizontalMargin.toString() + "px",
            },
            input: {
              width: inputSize.toString() + "px",
              height: inputSize.toString() + "px",
              borderRadius: "10px",
              border: "2px solid white",
              position: "relative",
            }
          },
        registeredPin: '',
        oldPin: '',

        states: {
          check: 1,
          registration: 2,
          confirmation: 3,
        },

        state: 0,

        showRegistration: (this as any).isRegisterMode() && this.value,
        showSuccess: false,
      }
    },
    methods: {
      async onClickedCode(code: number) {
        this.input = this.input + code.toString();

        if (this.input.length >= 6) {
          if (this.isCheckMode()) {
            // check with current encrypted account
            if (await PinCodeHelper.check(this.input)) {
              await this.closeView();
            }
            else {
              this.retry();
            }
          }
          else if (this.isRegisterMode()) {
            if (this.state === this.states.registration) {
              this.registeredPin = this.input;
              this.input = '';
              this.state = this.states.confirmation;
            } else {
              if (this.registeredPin === this.input) {
                this.showSuccess = true;
                await WalletsHelper.encryptWallets(PinCodeHelper.defaultPin, this.input);
                await PinCodeHelper.update(this.input);
              } else {
                this.retry();
              }
            }
          }
          else if (this.isChangeMode()) {
            // check with current encrypted account
            if (this.state === this.states.check) {
              if (await PinCodeHelper.check(this.input)) {
                this.oldPin = this.input;
                this.input = '';
                this.state = this.states.registration;
              }
              else {
                this.retry();
              }
            } else if (this.state === this.states.registration) {
              this.registeredPin = this.input;
              this.input = '';
              this.state = this.states.confirmation;
            } else {
              if (this.registeredPin === this.input) {
                const oldPin = (await PinCodeHelper.hasSavedCode()) ? this.oldPin : PinCodeHelper.defaultPin;
                if (await WalletsHelper.encryptWallets(oldPin, this.input)) {
                  await PinCodeHelper.update(this.input);
                  this.showSuccess = true;
                } else {
                  this.showError('Failed to change pin!');
                  await this.cancel();
                }
              } else {
                this.retry();
              }
            }
          }
        }
      },
      async closeView() {
        this.$emit('input', false);
        this.$emit('pass', this.input);
        await this.initializeState();
      },
      async cancel() {
        this.input = '';
        this.$emit('input', false);
        this.$emit('cancel');
        await this.initializeState();
      },

      isCheckMode(): boolean {
        return this.mode === 'check';
      },
      isRegisterMode(): boolean {
        return this.mode === 'register';
      },
      isChangeMode(): boolean {
        return this.mode === 'change';
      },
      retry() {
        this.showError(this.$t('common.pin_retry').toString());
        this.input = ""
      },
      async initializeState() {
        if (this.isCheckMode()) {
          this.state = this.states.check;
        } else if (this.isRegisterMode()){
          this.state = this.states.registration;
        } else if (this.isChangeMode()) {
          if (await PinCodeHelper.hasSavedCode()) {
            this.state = this.states.check;
          } else {
            this.state = this.states.registration;
          }
        }

        this.oldPin = '';
        this.registeredPin = '';
        this.input = '';

      }
    },

    async mounted() {
      await this.initializeState();
    }
  });
</script>

<style scoped>

</style>

