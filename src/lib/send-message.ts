import chalk from 'chalk'
import Client from "../types/client.js";

const sendMessage = async (client: Client, threadId: string, message: string) => {
  try {
    const thread = client.ig.entity.directThread(threadId);

    await thread.broadcastText(message);
  } catch (err) {
    console.log(chalk.red("Message not sent"))
  }
};

export default sendMessage