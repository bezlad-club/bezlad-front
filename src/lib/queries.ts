export const ALL_SERVICES_QUERY = `*[_type == "service"]
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
  }`;

export const SERVICES_BY_IDS_QUERY = `*[_type == "service" && _id in $ids] {
  _id,
  title,
  price
}`;

export const GALLERY_IMAGES = `*[_type == "gallery"][0]{
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
}`;
