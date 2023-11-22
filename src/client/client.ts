import ora from "ora";
import logClientSafe, { sessionSaveFileExists } from "../lib/auth.js";
import Client from "../types/client.js";
import Thread from "../types/thread.js";
import { getInbox } from "../lib/inbox.js";
import Message, { castMessage } from "../types/message.js";
import sendMessage from "../lib/send-message.js";
import {
  askCommand,
  askCredentials,
  askDeleteMessage,
  askMessage,
  askThread,
} from "./prompts.js";
import { notify, renderMessages } from "./render.js";
import getStories, { displayStoryData } from "../lib/stories.js";

const commandDelete = async (thread: Thread, client: Client) => {
  const itemId = await askDeleteMessage(thread, client);
  let instagramThread = client.ig.entity.directThread(thread.id);
  let deleteSpinner = ora("Deleting item").start();
  await instagramThread.deleteItem(itemId);
  deleteSpinner.stop();
  console.log("🗑 Message deleted");
  return;
};

const commandStories = async (thread: Thread, client: Client) => {
  if (thread.group) {
    console.log("Cannot display stories from a group");
  } else {
    let storiesSpinner = ora("Fetching stories").start();
    const stories = await getStories(client, thread.users[0].username);
    storiesSpinner.stop()
    console.log("Stories from " + thread.users[0].username)
    if (stories.length > 0) {
      stories.forEach((media, index) => {
        displayStoryData(media, index);
      });
    } else {
      console.log("No stories from this user");
    }
  }
};

const handleMessage = async (
  messageText: string,
  client: Client,
  thread: Thread
) => {
  if (messageText.length == 0) return false;
  if (messageText == "/end" || messageText == "/exit" || messageText == "/stop") return true;
  if (messageText == "/delete" || messageText == "/remove" || messageText == "/dlt" || messageText == "/rm") {
    await commandDelete(thread, client);
    return false;
  }
  if (messageText == "/story" || messageText == "/str" || messageText == "/sto") {
    await commandStories(thread, client);
    return false;
  }
  if (messageText == "/cmd" || messageText == "/command" || messageText == "/") {
    let command = await askCommand();
    if (command == "exit") return true;
    if (command == "cancel") return false;
    if (command == "delete") await commandDelete(thread, client);
    if (command == "stories") await commandStories(thread, client);
    return false;
  }
  const messageSpinner = ora("Sending message");
  messageSpinner.start();
  await sendMessage(client, thread.id, messageText);
  messageSpinner.stop();
  return false;
};

export const openThread = async (thread: Thread, client: Client) => {
  var conversationEnded = false;

  renderMessages(thread, client);
  let threadSpinner = ora("Loading realtime").start();
  await client.ig.realtime.connect({
    irisData: await client.ig.feed.directInbox().request(),
  });
  threadSpinner.stop();

  client.ig.realtime.on("close", () => console.error("RealtimeClient closed"));

  client.ig.realtime.on("message", (messageRealtime: any) => {
    let messageData: any = messageRealtime.message;
    if (messageData.op == "add") {
      let message: Message = castMessage(messageData);
      if (message.threadId == thread.id) {
        // if (message.userId != client.userId) notify(thread.title);
        thread.messages.push(message);
        renderMessages(thread, client);
      }
    }
  });

  while (!conversationEnded) {
    const messageText = await askMessage();
    let stop = await handleMessage(messageText, client, thread);
    conversationEnded = stop;
  }
  client.ig.realtime.disconnect();
};

export const startInterface = async () => {
  var client: Client;
  console.clear();

  if (sessionSaveFileExists()) {
    let clientSpinner = ora("Logging client").start();
    client = await logClientSafe(null, null);
    clientSpinner.stop();
  } else {
    const credentials = await askCredentials();
    let clientSpinner = ora("Logging client").start();
    client = await logClientSafe(credentials.username, credentials.password);
    clientSpinner.stop();
  }
  while (true) {
    console.clear();
    const inboxSpinner = ora("Fetching threads").start();
    const inbox: Thread[] = await getInbox(client);
    inboxSpinner.stop();
    const threadIndex: number = await askThread(inbox);
    if (threadIndex == -1) break;
    if (threadIndex == -2) continue;
    const thread: Thread = inbox[threadIndex];
    await openThread(thread, client);
  }
};

export default startInterface;
