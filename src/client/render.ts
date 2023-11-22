import chalk from "chalk";
import notifier from "node-notifier";
import Client from "../types/client.js";
import Message from "../types/message.js";
import Thread from "../types/thread.js";

export const notify = (username: string) => {
  notifier.notify({
    title: "FuckZuck",
    message: "New message from: " + username,
  });
};

const getMessageString = (message: Message, client: Client, thread: Thread) => {
  var messageString = "";
  var today = new Date().toISOString().split("T")[0];

let messageDate = message.date.toISOString().split("T")[0]
  if (messageDate == today)
    messageString += chalk.dim("[today] ");
  else
    messageString += chalk.dim("[" + messageDate + "] ");
  if (message.userId == client.userId) {
    messageString += chalk.green(`You:  `);
  } else {
    messageString += chalk.magenta(`${thread.users[0].username}:  `);
  }
  if (message.media) {
    if (!message.media.expired) messageString += message.media.url;
    else messageString += chalk.gray("expired");
  }
  if (message.text) messageString += message.text + "\n";
  if (message.reactions) messageString += chalk.dim("["+ message.reactions + "]\n");
  
  return messageString;
};

export const renderMessages = (
  thread: Thread,
  client: Client,
) => {
  console.clear();
  var threadString = `Conversation with: ${thread.users[0].username}\n`;
  thread.messages.forEach((message: Message) => {
    let messageString = getMessageString(message, client, thread);
    threadString += messageString;
  });
  console.log(threadString);
};
