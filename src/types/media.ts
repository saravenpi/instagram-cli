import User, { castUser } from "./user.js";

export type Media = {
  type: string;
  url: string;
  expired: boolean;
  duration: number;
  tag: boolean
  user: User
};

export const castMedia = (mediaData: any, expired: boolean): Media => {
  var media: Media = {
    type: "",
    url: "",
    expired: expired,
    duration: 0,
    user: null,
    tag: false,
  } as Media;

  if (mediaData.media_type == 1) {
    media.type = "image";
    if (!expired) {
      if (mediaData.image_versions2)
        media.url = mediaData.image_versions2.candidates[0].url;
    }
    media.duration = 0;
  }
  if (mediaData.media_type == 2) {
    media.type = "video";
    if (!expired)
      if (mediaData.image_versions2)
        media.url = mediaData.video_versions[0].url;
    media.duration = 0
  }
  if (mediaData.media_type == 11) {
    media.type = "audio";
    if (!expired) {
      media.url = mediaData.audio.audio_src;
      media.duration = mediaData.audio_duration / 1000
    }
  }

  if (mediaData.user)
    media.user = castUser(mediaData.user);
  else
    media.tag = true
  if (!media.expired && !media.url)
    media.expired = true
  return media;
};

export default Media;
