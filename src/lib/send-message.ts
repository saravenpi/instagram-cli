import chalk from 'chalk'
import Client from "../types/client.js";

const sendMessage = async (client: Client, username: string, message: string) => {
  try {
    const userId = await client.ig.user.getIdByUsername(username);
    const thread = client.ig.entity.directThread([userId.toString()]);

    await thread.broadcastText(message);
  } catch (err) {
    console.log(chalk.red("Message not sent"))
  }
};

export default sendMessage