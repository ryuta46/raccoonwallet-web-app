import {MUTATION_TYPES} from "./mutationTypes";
import Vue from 'vue';
import Vuex from 'vuex';
import {MosaicId, MosaicProperties, MosaicTransferable, XEM} from "nem-library";

import createPersistedState from "vuex-persistedstate";
import {TransactionWrapper} from "./transactionWrapper";

Vue.use(Vuex);

const sendDefault: { [key: string]: MosaicTransferable} = {};

export default new Vuex.Store ({
  state: {
    returnPath: "",
    calculatorFormula: '0',
    calculatorValue: 0,
    receiverAddress: '',
    receiverPublicKey: '',
    sendMosaics: sendDefault,
    sendMessage: '',
    usesMessageEncryption: false,
    backPathFromWalletSelect: '',
    backPathFromLesson: '',
    backPathFromKey: '',
    backPathFromSendConfirmation: '',
    transaction: <TransactionWrapper | null>null,
  },
  mutations: {
    [MUTATION_TYPES.SET_CALCULATOR_FORMULA] (state, value: string ) {
      state.calculatorFormula = value;
    },

    [MUTATION_TYPES.APPEND_CALCULATOR_FORMULA] (state, value: string) {
      if (state.calculatorFormula === '0' && isFinite(Number(value))) {
        state.calculatorFormula = value;
      } else {
        state.calculatorFormula += value;
      }
    },
    [MUTATION_TYPES.DROP_CALCULATOR_FORMULA] (state) {
      if (state.calculatorFormula.length <= 1) {
        state.calculatorFormula = '0';
      } else {
        state.calculatorFormula = state.calculatorFormula.slice(0, -1);
      }
    },

    [MUTATION_TYPES.CLEAR_CALCULATOR_FORMULA] (state ) {
      state.calculatorFormula = '0';
    },
    [MUTATION_TYPES.SET_CALCULATOR_VALUE] (state, value: number ) {
      state.calculatorValue = value;
    },

    [MUTATION_TYPES.SET_RECEIVER_ADDRESS] (state, address: string ) {
      state.receiverAddress = address;
    },

    [MUTATION_TYPES.CLEAR_RECEIVER_ADDRESS] (state ) {
      state.receiverAddress = '';
    },

    [MUTATION_TYPES.SET_RECEIVER_PUBLIC_KEY] (state, publicKey: string ) {
      state.receiverPublicKey = publicKey;
    },

    [MUTATION_TYPES.CLEAR_RECEIVER_PUBLIC_KEY] (state) {
      state.receiverPublicKey = ''
    },

    [MUTATION_TYPES.ADD_SEND_MOSAIC] (state, mosaic: MosaicTransferable) {
      state.sendMosaics[mosaic.mosaicId.description()] = mosaic;
    },

    [MUTATION_TYPES.REMOVE_SEND_MOSAIC] (state, name: string) {
      delete state.sendMosaics[name];
    },

    [MUTATION_TYPES.CLEAR_SEND_MOSAIC] (state) {
      for(let key in state.sendMosaics){
        delete state.sendMosaics[key]
      }
      Object.assign(state.sendMosaics, sendDefault);

      const xem = new XEM(0);
      state.sendMosaics[xem.mosaicId.description()] = xem;
    },
    [MUTATION_TYPES.SET_SEND_MESSAGE] (state, message: string ) {
      state.sendMessage = message;
    },

    [MUTATION_TYPES.CLEAR_SEND_MESSAGE] (state ) {
      state.sendMessage = '';
    },

    [MUTATION_TYPES.SET_MESSAGE_ENCRYPTION] (state, usesEncryption: boolean ) {
      state.usesMessageEncryption = usesEncryption;
    },

    [MUTATION_TYPES.SET_BACK_PATH_FROM_WALLET_SELECT] (state, backPath: string) {
      state.backPathFromWalletSelect = backPath;
    },

    [MUTATION_TYPES.SET_BACK_PATH_FROM_LESSON] (state, backPath: string) {
      state.backPathFromLesson = backPath;
    },

    [MUTATION_TYPES.SET_BACK_PATH_FROM_KEY] (state, backPath: string) {
      state.backPathFromKey = backPath;
    },

    [MUTATION_TYPES.SET_BACK_PATH_FROM_SEND_CONFIRMATION] (state, backPath: string) {
      state.backPathFromSendConfirmation = backPath;
    },

    [MUTATION_TYPES.SET_TRANSACTION] (state, transaction: TransactionWrapper) {
      state.transaction = transaction;
    },

    [MUTATION_TYPES.SETUP_TYPES] (state) {
      let nonTypedMap = state.sendMosaics as any;
      const mosaics: { [key: string]: MosaicTransferable} = {};
      for(let key of Object.keys(nonTypedMap)) {
        const nonTypedTransferable = nonTypedMap[key];
        const mosaicId = new MosaicId(nonTypedTransferable.mosaicId.namespaceId, nonTypedTransferable.mosaicId.name);
        const properties = Object.assign(new MosaicProperties(), nonTypedTransferable.properties);
        mosaics[key] = new MosaicTransferable(mosaicId, properties, nonTypedTransferable.amount);
     }
      state.sendMosaics = mosaics;
    }

  },
  plugins: [createPersistedState()]
});
