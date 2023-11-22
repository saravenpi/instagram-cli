import chalk from "chalk";
import Client from "../types/client.js";
import Thread, { castThread } from "../types/thread.js";
import Message from "../types/message.js";

export const getInbox = async (client: Client): Promise<Thread[]> => {
  const allThreads = await client.ig.feed.directInbox().items();
  const inbox: Thread[] = [];

  allThreads.forEach((threadData: any) => {
    let thread = castThread(threadData);
    inbox.push(thread);
  });

  return inbox;
};

export const readInbox = async (inbox: Thread[]) => {
  inbox.forEach((thread: Thread) => {
    console.log("Title: " + thread.title);
    thread.messages.forEach((message: Message) => {
      console.log("\ttype: " + chalk.cyan(message.type));
      if (message.media) {
        if (!message.media.expired)
          console.log("\tmediaUrl: " + chalk.cyan(message.media.url));
        else console.log("\tmedia: " + chalk.cyan("expired"));
      }
      if (message.text) console.log("\ttext: " + chalk.cyan(message.text));
      if (message.reactions)
        console.log("\treactions: " + chalk.cyan(message.reactions));
      console.log("\n");
    });
    console.log("\n\n");
  });
};

export default readInbox;
