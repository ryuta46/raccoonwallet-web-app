<template>
  <div style="width: 100vw">
    <tool-bar back="/top?tab=home" :title="$t('common.mosaic_gallery')"></tool-bar>
    <v-content app>
      <div v-if="loadingXemBookList || loadingMosaics" style="display: flex; justify-content: center; align-items: center; height: 80vh">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-layout v-else-if="hasImage()" raw wrap fluid>
        <template v-for="mosaic in ownedMosaics">
          <v-flex v-if="mosaic.mosaicId.description() in imageUrls" xs4 sm3 lg2 style="padding: 2px">
            <div class="adjust-box">
              <div class="inner" @click="openDialog(mosaic.mosaicId.name, mosaic.mosaicId.namespaceId, imageUrls[mosaic.mosaicId.description()])">
                <img class="image" :src="imageUrls[mosaic.mosaicId.description()]">
              </div>
            </div>
          </v-flex>
        </template>
      </v-layout>
      <div v-else style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 80vh">
        <img src="../../../assets/image_empty2_large.png" width="50%">
        <span class="app-large-text app-secondary-text">{{$t('gallery.no_mosaic_title')}}</span>
        <br>
        <span v-for="sentence in $t('gallery.no_mosaic_message')">{{ sentence }}<br></span>
      </div>

    </v-content>

    <v-dialog v-model="showDialog" max-width="500">
        <div style="display: flex; flex-direction: column; background-color: white" >
          <img class="image" :src="targetImageUrl" >
          <span>{{'Name: ' + targetName}}</span>
          <span>{{'NameSpace: ' + targetNamespaceId}}</span>
        </div>

    </v-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {getXemBookMosaicList} from "../../../lib/mosaicUtils";
  import BalanceModule from "../../mixins/BalanceModule";
  import ToolBar from '../../parts/ToolBar.vue';

  const imageUrlsDefault: { [key: string]: string} = {};

  export default Vue.extend({
    components: {ToolBar},
    mixins: [BalanceModule],

    name: "MosaicGallery",

    data () {
      return {
        imageUrls: Object.assign({}, imageUrlsDefault),
        targetName:'',
        targetNamespaceId: '',
        targetImageUrl: '',
        showDialog: false,
        loadingXemBookList: false,
        loadingMosaics: false,
      }
    },

    mounted() {
      this.updateImageUrl()
    },

    methods: {
      updateImageUrl() {
        this.loadingXemBookList = true;
        this.loadingMosaics = true;

        this.imageUrls = Object.assign({}, imageUrlsDefault);
        getXemBookMosaicList().then((json) => {
          for(let imageInfo of json) {
            this.imageUrls[imageInfo.namespace + '.' + imageInfo.name] = imageInfo.url;
          }
          this.loadingXemBookList = false;
        });

        this.fetchBalance(true,
          (balance, mosaics) => {
            for(let mosaic of mosaics) {
              const description = this.mosaicDescriptions[mosaic.mosaicId.description()];

              if (description.includes('oa:')) {
                const oaString = description.replace(/oa:/g, "");
                this.imageUrls[mosaic.mosaicId.description()] = "https://s3.amazonaws.com/open-apostille-nemgallary-production/" + oaString + ".jpg";
              }
            }
            this.loadingMosaics = false;
          }
        )
      },
      openDialog(name: string, namespaceId: string, imageUrl: string) {
        this.targetName = name;
        this.targetNamespaceId = namespaceId;
        this.targetImageUrl = imageUrl;

        this.showDialog = true;
      },

      hasImage(): boolean {
        for (let mosaic of this.ownedMosaics) {
          if (mosaic.mosaicId.description() in this.imageUrls) {
            return true;
          }
        }
        return false
      }
    }

  });
</script>
<style scoped>
  .adjust-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 100% 0 0;
  }
  .inner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .image {
    max-width: 100%;
    max-height: 100%;
  }
</style>
