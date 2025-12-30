import { defineQuery } from "next-sanity";

export const ALL_SERVICES_QUERY = defineQuery(`*[_type == "service"]
  | order(menuOrder asc, title asc) {
    _id,
    title,
    description,
    price,
    menuOrder,
    paymentUrl,
    image{
      crop,
      hotspot,
      asset->{
        _id,
        url
      }
    }
  }`);

export const SERVICES_BY_IDS_QUERY = defineQuery(`*[_type == "service" && _id in $ids] {
  _id,
  title,
  price
}`);

export const GALLERY_IMAGES_QUERY = defineQuery(`*[_type == "gallery"][0]{
  photo1{
    crop,
    hotspot,
    asset->{
      _id,
      url,
      metadata {dimensions}
    }
  },
  photo2{
    crop,
    hotspot,
    asset->{
      _id,
      url,
      metadata {dimensions}
    }
  },
  photo3{
    crop,
    hotspot,
    asset->{
      _id,
      url,
      metadata {dimensions}
    }
  },
  photo4{
    crop,
    hotspot,
    asset->{
      _id,
      url,
      metadata {dimensions}
    }
  },
  photo5{
    crop,
    hotspot,
    asset->{
      _id,
      url,
      metadata {dimensions}
    }
  }
}`);

export const PROMO_CODE_VALIDATION_QUERY = defineQuery(`*[_type == "promoCode" && code == $code][0] {
  ...,
  "activeReservationsCount": count(*[_type == "promoCodeReservation" && promoCode._ref == ^._id && status == "reserved" && validUntil > now()]),
  "applicableServices": applicableServices[]->._id
}`);

export const PROMO_CODE_BY_ID_TYPE_ONLY_QUERY = defineQuery(`*[_id == $id][0]{type}`);

export const RESERVATION_BY_ID_QUERY = defineQuery(`*[_type == "promoCodeReservation" && _id == $id][0]`);

export const RESERVATION_FOR_VALIDATION_QUERY = defineQuery(`*[_type == "promoCodeReservation" && _id == $id][0]{
  status,
  validUntil,
  promoCode->{
    discountPercent,
    "applicableServices": applicableServices[]->._id
  }
}`);

export const RESERVATION_FOR_CALLBACK_QUERY = defineQuery(`*[_type == "promoCodeReservation" && orderReference == $ref][0]{
  _id,
  status,
  validUntil,
  promoCode
}`);

export const EXPIRED_RESERVATIONS_QUERY = defineQuery(`*[_type == "promoCodeReservation" && status in ["reserved", "expired"] && validUntil < now()][0...10]`);
