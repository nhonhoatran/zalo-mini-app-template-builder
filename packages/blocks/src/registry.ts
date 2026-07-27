import { MvpBlockType, MVP_BLOCK_TYPES } from "@zalo-builder/schema";
import { BlockManifest } from "./block-manifest-type";
import { bannerManifest } from "./blocks/banner/manifest";
import { richTextManifest } from "./blocks/rich-text/manifest";
import { imageGalleryManifest } from "./blocks/image-gallery/manifest";
import { contactInfoManifest } from "./blocks/contact-info/manifest";
import { mapLocationManifest } from "./blocks/map-location/manifest";
import { productListManifest } from "./blocks/product-list/manifest";
import { productDetailManifest } from "./blocks/product-detail/manifest";
import { cartButtonManifest } from "./blocks/cart-button/manifest";
import { bookingFormManifest } from "./blocks/booking-form/manifest";
import { servicePriceListManifest } from "./blocks/service-price-list/manifest";
import { privacyPolicyManifest } from "./blocks/privacy-policy/manifest";
import { permissionRequestManifest } from "./blocks/permission-request/manifest";

export const BLOCK_REGISTRY: Record<MvpBlockType, BlockManifest<any>> = {
  banner: bannerManifest,
  "rich-text": richTextManifest,
  "image-gallery": imageGalleryManifest,
  "contact-info": contactInfoManifest,
  "map-location": mapLocationManifest,
  "product-list": productListManifest,
  "product-detail": productDetailManifest,
  "cart-button": cartButtonManifest,
  "booking-form": bookingFormManifest,
  "service-price-list": servicePriceListManifest,
  "privacy-policy": privacyPolicyManifest,
  "permission-request": permissionRequestManifest,
};

export function getBlockManifest(type: MvpBlockType): BlockManifest<any> {
  const manifest = BLOCK_REGISTRY[type];
  if (!manifest) {
    throw new Error(`Loại block '${type}' không tồn tại trong BLOCK_REGISTRY`);
  }
  return manifest;
}

export function getAllBlockManifests(): BlockManifest<any>[] {
  return MVP_BLOCK_TYPES.map((type) => getBlockManifest(type));
}
