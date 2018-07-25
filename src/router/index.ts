import Vue from 'vue'
import Router from 'vue-router'

import Top from '../components/pages/top/Top.vue'

import Balance from '../components/pages/detail/Balance.vue'
import TransactionList from '../components/pages/transaction/TransactionList.vue'
import TransactionDetail from '../components/pages/transaction/TransactionDetail.vue'

import WalletSelect from '../components/pages/wallet/WalletSelect.vue'
import WalletCreationType from '../components/pages/wallet/WalletCreationType.vue'
import WalletCreationName from '../components/pages/wallet/WalletCreationName.vue'
import WalletCreationNew from '../components/pages/wallet/WalletCreationNew.vue'
import WalletCreationEnd from '../components/pages/wallet/WalletCreationEnd.vue'
import WalletLoginImport from '../components/pages/wallet/WalletLoginImport.vue'
import WalletLoginName from '../components/pages/wallet/WalletLoginName.vue'
import WalletLoginEnd from '../components/pages/wallet/WalletLoginEnd.vue'

import WalletSettings from '../components/pages/wallet/WalletSettings.vue'
import WalletAddress from '../components/pages/wallet/WalletAddress.vue'
import WalletBackupCaution from '../components/pages/wallet/WalletBackupCaution.vue'
import WalletBackup from '../components/pages/wallet/WalletBackup.vue'
import WalletDelete from '../components/pages/wallet/WalletDelete.vue'
import WalletDetail from '../components/pages/wallet/WalletDetail.vue'

import LessonIntroduction from '../components/pages/lesson/LessonIntroduction.vue'
import LessonLevel from '../components/pages/lesson/LessonLevel.vue'
import LessonBeginner from '../components/pages/lesson/LessonBeginner.vue'
import LessonPrivateKeyCaution from '../components/pages/wallet/WalletBackupCaution.vue'
import LessonPrivateKey from '../components/pages/wallet/WalletBackup.vue'
import LessonBeginnerBackupEnd from '../components/pages/lesson/LessonBeginnerBackupEnd.vue'
import LessonBeginnerEnd from '../components/pages/lesson/LessonBeginnerEnd.vue'
import LessonLogin from '../components/pages/lesson/LessonLogin.vue'
import LessonLoginEnd from '../components/pages/lesson/LessonLoginEnd.vue'
import LessonUser from '../components/pages/lesson/LessonUser.vue'
import QRGeneratorAmount from '../components/pages/qrlab/QRGeneratorAmount.vue'
import InvoiceQR from '../components/pages/qrlab/InvoiceQR.vue';

import SendAmount from '../components/pages/send/SendAmount.vue';
import SendMode from '../components/pages/send/SendMode.vue';
import SendConfirmation from '../components/pages/send/SendConfirmation.vue';
import SendMessage from '../components/pages/send/SendMessage.vue';
import SendComplete from '../components/pages/send/SendComplete.vue';

import AboutThisApp from '../components/pages/about/AboutThisApp.vue';
import MosaicGallery from '../components/pages/gallery/MosaicGallery.vue';
import DonationTop from '../components/pages/donation/DonationTop.vue';
import DonationDetail from '../components/pages/donation/DonationDetail.vue';

import SettingsTop from '../components/pages/settings/SettingsTop.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', redirect: '/top' },
    { path: '/top', name: 'Top', component: Top, props: (route) => ({ tab: route.query.tab }) },
    { path: '/balance', name: 'Balance', component: Balance },
    { path: '/transaction/list', name: 'TransactionList', component: TransactionList } ,
    { path: '/transaction/detail', name: 'TransactionDetail', component: TransactionDetail } ,

    { path: '/wallet/select', name: 'WalletSelect', component: WalletSelect },
    { path: '/wallet/creation/type', name: 'WalletCreationType', component: WalletCreationType },
    { path: '/wallet/creation/name', name: 'WalletCreationName', component: WalletCreationName },
    { path: '/wallet/creation/new', name: 'WalletCreationNew', component: WalletCreationNew },
    { path: '/wallet/creation/end', name: 'WalletCreationEnd', component: WalletCreationEnd },
    { path: '/wallet/login/import', name: 'WalletLoginImport', component: WalletLoginImport },
    { path: '/wallet/login/name', name: 'WalletLoginName', component: WalletLoginName },
    { path: '/wallet/login/end', name: 'WalletLoginEnd', component: WalletLoginEnd },
    { path: '/wallet/settings', name: 'WalletSettings', component: WalletSettings, props: (route) => ({ id: route.query.id }) },
    { path: '/wallet/address', name: 'WalletAddress', component: WalletAddress, props: (route) => ({ id: route.query.id }) },

    { path: '/wallet/backup_caution', name: 'WalletBackupCaution', component: WalletBackupCaution, props: (route) => ({ id: route.query.id }) },
    { path: '/wallet/backup', name: 'WalletBackup', component: WalletBackup, props: (route) => ({ id: route.query.id }) },
    { path: '/wallet/delete', name: 'WalletDelete', component: WalletDelete, props: (route) => ({ id: route.query.id }) },
    { path: '/wallet/detail', name: 'WalletDetail', component: WalletDetail, props: (route) => ({ id: route.query.id }) },

    { path: '/lesson/introduction', name: 'LessonIntroduction', component: LessonIntroduction },
    { path: '/lesson/level', name: 'LessonLevel', component: LessonLevel },
    { path: '/lesson/beginner', name: 'LessonBeginner', component: LessonBeginner },
    { path: '/lesson/beginner_backup_end', name: 'LessonBeginnerBackupEnd', component: LessonBeginnerBackupEnd },
    { path: '/lesson/beginner_end', name: 'LessonBeginnerEnd', component: LessonBeginnerEnd },
    { path: '/lesson/key/caution', name: 'LessonPrivateKeyCaution', component: WalletBackupCaution, props: {lesson: true} },
    { path: '/lesson/key', name: 'LessonPrivateKey', component: WalletBackup, props: {lesson: true}},
    { path: '/lesson/login', name: 'LessonLogin', component: LessonLogin },
    { path: '/lesson/login_end', name: 'LessonLoginEnd', component: LessonLoginEnd },
    { path: '/lesson/user', name: 'LessonUser', component: LessonUser },
    { path: '/qrlab/amount', name: 'QRGeneratorAmount', component: QRGeneratorAmount },
    { path: '/qrlab/invoice', name: 'InvoiceQR', component: InvoiceQR, props: (route) => ({ amount: route.query.amount, rate: route.query.rate }) },

    { path: '/send/amount', name: 'SendAmount', component: SendAmount },
    { path: '/send/mode', name: 'SendMode', component: SendMode },
    { path: '/send/message', name: 'SendMessage', component: SendMessage },
    { path: '/send/confirmation', name: 'SendConfirmation', component: SendConfirmation },
    { path: '/send/complete', name: 'SendComplete', component: SendComplete },

    { path: '/about', name: 'AboutThisApp', component: AboutThisApp },

    { path: '/gallery', name: 'MosaicGallery', component: MosaicGallery },

    { path: '/donation/top', name: 'DonationTop', component: DonationTop },
    { path: '/donation/detail', name: 'DonationDetail', component: DonationDetail, props: (route) => ({ target: route.query.target }) },

    { path: '/settings/top', name: 'SettingsTop', component: SettingsTop } ,

  ]
})
