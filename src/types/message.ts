import { Link, castLink } from "./link.js";
import Media, { castMedia } from "./media.js";

export type Message = {
  text: string;
  date: Date;
  id: string;
  threadId: string;
  userId: number;
  type: string;
  media: Media;
  link: Link;
  reactions: string;
};

export const castMessage = (messageData: any): Message => {
  var message: Message = {
    text: null,
    date: new Date(Number(messageData.timestamp) / 1000),
    userId: messageData.user_id,
    type: messageData.item_type,
    id: messageData.item_id,
    threadId: messageData.thread_id,
    media: null,
    link: null,
    reactions: null,
  } as Message;
  if (messageData.reactions) {
    let reactionsString = "";

    if (messageData.reactions.likes) {
        messageData.reactions.likes.forEach(like => {
            reactionsString += "💗"
        });
    }
    if (messageData.reactions.emojis) {
      messageData.reactions.emojis.forEach((emojiElement: any) => {
        reactionsString += emojiElement.emoji;
      });
    }
    

    message.reactions = reactionsString;
  }

  if (message.type == "text") {
    message.text = messageData.text;
  }

  if (message.type == "link") {
    message.link = castLink(messageData.link);
    message.text = message.link.text;
  }

  if (message.type == "action_log") {
    message.text = messageData.action_log.description;
  }

  if (message.type == "voice_media") {
    message.media = castMedia(messageData.voice_media.media, false);
  }

  if (message.type == "media") {
    message.media = castMedia(messageData.media, false);
  }

  if (message.type == "raven_media") {
    message.media = castMedia(messageData.visual_media.media, false);
  }

  if (message.type == "reel_share") {
    message.media = castMedia(
      messageData.reel_share.media,
      messageData.reel_share.is_reel_persisted
    );
  }

  if (message.type == "media_share") {
    let tagged: boolean = messageData.direct_media_share ? true : false;

    if (tagged) {
      message.media = castMedia(messageData.direct_media_share, false);
    } else {
      message.media = castMedia(messageData.media_share, false);
    }
  }

  return message;
};
export default Message;
