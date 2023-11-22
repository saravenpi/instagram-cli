import chalk from "chalk";
import notifier from "node-notifier";
import Client from "../types/client.js";
import Message from "../types/message.js";
import Thread from "../types/thread.js";
import User from "../types/user.js";

export const notify = (username: string) => {
  notifier.notify({
    title: "instagram-cli",
    message: "New message from: " + username,
  });
};

const getUsernameFromId = (thread: Thread, userId: number) => {
  var username = "noname";
  thread.users.forEach((user: User) => {
    if (user.id == userId) username = user.username;
  });
  return username;
};

const getMessageString = (message: Message, client: Client, thread: Thread) => {
  var messageString = "";
  var today = new Date().toISOString().split("T")[0];

  let messageDate = message.date.toISOString().split("T")[0];
  if (messageDate == today) messageString += chalk.dim("[today] ");
  else messageString += chalk.dim("[" + messageDate + "] ");
  if (message.userId == client.userId) {
    messageString += chalk.green(`You:  `);
  } else {
    let username = getUsernameFromId(thread, message.userId);
    messageString += chalk.magenta(`${username}:  `);
  }
  if (message.media) {
    if (!message.media.expired) messageString += message.media.url;
    else messageString += chalk.gray("expired");
  }
  if (message.text) {
    if (message.type == "action_log" || message.type == "placeholder")
      messageString += chalk.dim(message.text);
    else messageString += message.text;
  }
  if (!message.media && !message.text)
    messageString += chalk.gray(message.type);
  messageString += "\n";
  if (message.reactions)
    messageString += chalk.dim("[" + message.reactions + "]\n");

  return messageString;
};

export const renderMessages = (thread: Thread, client: Client) => {
  console.clear();
  if (thread.group)
    var threadString = `Conversation with group: ${thread.title}\n`;
  else var threadString = `Conversation with: ${thread.users[0].username}\n`;
  thread.messages.forEach((message: Message) => {
    let messageString = getMessageString(message, client, thread);
    threadString += messageString;
  });
  console.log(threadString);
};
