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

const handleDelete = async (thread: Thread, client: Client) => {
  const itemId = await askDeleteMessage(thread, client);
  let instagramThread = client.ig.entity.directThread(thread.id);
  let deleteSpinner = ora("Deleting item").start();
  await instagramThread.deleteItem(itemId);
  deleteSpinner.stop();
  console.log("🗑 Message deleted")
  return;
};

const handleMessage = async (
  messageText: string,
  client: Client,
  thread: Thread
) => {
  if (messageText.length == 0) return false;
  if (messageText == "/end" || messageText == "/exit") return true;
  if (messageText == "/delete" || messageText == "/remove") {
    await handleDelete(thread, client);
    return false;
  }
  if (messageText == "/cmd" || messageText == "/command") {
    let command = await askCommand();
    if (command == "exit") return true;
    if (command == "delete") await handleDelete(thread, client);
    if (command == "cancel") return false;
    return false;
  }
  const messageSpinner = ora("Sending message");
  messageSpinner.start();
  await sendMessage(client, thread.users[0].username, messageText);
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
        if (message.userId != client.userId) notify(thread.users[0].username);
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
  console.clear();
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
    if (threadIndex == -1)
      break;
    const thread: Thread = inbox[threadIndex];
    await openThread(thread, client);
  }
};

export default startInterface;
