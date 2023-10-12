export interface Article {
  id: number;
  id_user: number;
  abstract: string;
  subtitle: string;
  update_date: string;
  category: string;
  title: string;
  image_data: string;
  // service response data is  thumbnail_image and thumbnail_media_type,is not image_data and image_media_type, so add
  thumbnail_image?: string;
  image_media_type: string;
  thumbnail_media_type?: string;
  body: string;
  username: string;
}
