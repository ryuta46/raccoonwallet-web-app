import Decimal from "decimal.js";
import {getDivided} from "./numberUtils";
import {Mosaic, MosaicDefinition, MosaicTransferable} from "nem-library";

export function createMosaicTransferableFrom(definition: MosaicDefinition, quantity: number): MosaicTransferable {
  return MosaicTransferable.createWithMosaicDefinition(
    definition,
    getDivided(quantity, definition.properties.divisibility).toNumber());
}

export function createWithNewAmount(mosaic: MosaicTransferable, amount: number): MosaicTransferable {
  return new MosaicTransferable(mosaic.mosaicId, mosaic.properties, amount, mosaic.levy)
}

export function getXemBookMosaicList() {
  return fetch("https://s3-ap-northeast-1.amazonaws.com/xembook.net/gallery/mosaic_list.json")
    .then((response) => {
      return response.json()
    })
}
