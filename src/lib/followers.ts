import chalk from "chalk";
import Client from "../types/client.js";

export const displayFollowersUsernames = (followers: any[]) => {
  followers.forEach((follower, index) => {
    console.log(`${index}: ${follower.username}`);
  });
  console.log("Loaded " + chalk.cyan(followers.length) + " followers");
};

export const getFollowersList = async (client: Client) => {
  console.log("Loading your followers list...");
  const followersFeed = client.ig.feed.accountFollowers(client.userId);
  const followersSubscription = followersFeed.items$.toPromise();
  const followersList = await followersSubscription;
  
  return followersList;
};

export default getFollowersList;
