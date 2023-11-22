import Client from "../types/client.js";
import chalk from "chalk";
import Media from "../types/media.js";
import { castMedia } from "../types/media.js";

export const displayStoryData = (media: Media, index: number) => {
  console.log(chalk.dim(`[${media.type}] `) + chalk.cyan("Story " + index + ": ") + media.url)
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
