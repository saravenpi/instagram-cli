import Client from "../types/client.js";
import chalk from "chalk";
import Media from "../types/media.js";
import { castMedia } from "../types/media.js";

export const displayStoryData = (storyData: any) => {
  let storyType = storyData.media_type;
  if (storyType == 1) {
    let photoUrl = storyData.image_versions2.candidates[0].url;
    console.log("Photo url: " + chalk.green(photoUrl));
  }
  if (storyType == 2) {
    let videoDuration = storyData.video_duration;
    let videoUrl = storyData.video_versions[0].url;
    console.log("Duration: " + chalk.cyan(videoDuration + "s"));
    console.log("Video url: " + chalk.green(videoUrl));
  }
  console.log("\n");
};

export const getStories = async (
  client: Client,
  username: string
): Promise<Media[]> => {
  const targetUser = await client.ig.user.searchExact(username);
  const reelsFeed = client.ig.feed.reelsMedia({
    userIds: [targetUser.pk],
  });
  const storyItems = await reelsFeed.items();
  var stories: Media[] = [];

  storyItems.forEach((storyData) => {
    let story = castMedia(storyData, false);
    stories.push(story);
  });

  return stories;
};

export default getStories;
