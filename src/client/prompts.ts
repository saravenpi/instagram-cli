import inquirer from "inquirer";
import Thread from "../types/thread";
import chalk from "chalk";
import Message from "../types/message";
import Client from "../types/client";

export const askThread = async (inbox: Thread[]): Promise<number> => {
  var inquirerListChoices = [];

  inbox.forEach((thread: Thread, index: number) => {
    let threadTitle = "";
    if (thread.unread) threadTitle += chalk.dim("[📨]");
    else threadTitle += chalk.dim("[seen]");
    if (thread.group) threadTitle += chalk.dim("[group]");
    threadTitle += " " + thread.title
    let inquirerListElement = {
      name: threadTitle,
      value: index,
      short: thread.title,
    };
    inquirerListChoices.push(inquirerListElement);
  });
  inquirerListChoices.push({
    name: "📤 Exit",
    value: -1,
    short: "📤 Exit",
  });
  const { threadIndex } = await inquirer.prompt({
    name: "threadIndex",
    message: "Conversation thread: ",
    type: "list",
    loop: false,
    choices: inquirerListChoices,
  });

  return threadIndex;
};

export const askMessage = async (): Promise<string> => {
  const { messageText } = await inquirer.prompt({
    type: "input",
    name: "messageText",
    message: "Message: ",
  });
  return messageText;
};

export const askCredentials = async () => {
  const { username, password } = await inquirer.prompt([
    {
      name: "username",
      message: "Instagram Username: ",
    },
    {
      name: "password",
      message: "Instagram Password: ",
      type: "password",
    },
  ]);
  return {
    username: username,
    password: password,
  };
};

export const askCommand = async () => {
  const inquirerListChoices = [
    {
      name: "📱 Watch user story",
      value: "stories",
      short: "📱 Watch user story",
    },
    {
      name: "🗑 Delete a message",
      value: "delete",
      short: "Delete a message",
    },
    {
      name: "📤 Exit",
      value: "exit",
      short: "Exit",
    },
    {
      name: "❌ Cancel",
      value: "cancel",
      short: "❌ Cancel",
    },
  ];

  const { command } = await inquirer.prompt([
    {
      name: "command",
      message: "Command choice: ",
      type: "list",
      loop: false,
      choices: inquirerListChoices,
    },
  ]);
  return command;
};

export const askDeleteMessage = async (thread: Thread, client: Client) => {
  const inquirerListChoices = [];
  let today = new Date().toISOString().split("T")[0];

  thread.messages.forEach((message: Message) => {
    if (message.userId == client.userId) {
      let messageShortDate = message.date.toISOString().split("T")[0];
      messageShortDate = messageShortDate == today ? "today" : messageShortDate;
      let messageString = chalk.dim(` [${messageShortDate}] `) + message.text;
      inquirerListChoices.push({
        name: messageString,
        value: message.id,
        short: messageString,
      });
    }
  });

  const { itemId } = await inquirer.prompt([
    {
      name: "itemId",
      message: "Message to delete: ",
      type: "list",
      loop: false,
      choices: inquirerListChoices,
    },
  ]);
  return itemId;
};
