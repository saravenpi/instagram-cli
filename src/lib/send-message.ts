import chalk from "chalk";
import Client from "../types/client.js";
import requestPromise from 'request-promise' 
import ora from "ora";

export const sendMessage = async (
  client: Client,
  threadId: string,
  message: string
) => {
  try {
    const thread = client.ig.entity.directThread(threadId);

    await thread.broadcastText(message);
  } catch (err) {
    console.log(chalk.red("Message not sent"));
  }
};

export const sendImageFromUrl = async (
  client: Client,
  threadId: string,
  url: string
) => {
  let sendSpinner = ora("Sending image")
  try {
    const thread = client.ig.entity.directThread(threadId);
    let downloadSpinner = ora("Downloading image from url").start()
    const imageBuffer = await requestPromise.get({
      url: url,
      encoding: null
    })
    downloadSpinner.stop()
    sendSpinner.start()
    await thread.broadcastPhoto({
      file: imageBuffer
    })
    sendSpinner.stop()
  } catch (err) {
    sendSpinner.stop()
    console.log(chalk.red("Message not sent"));
  }
};

export const sendImageStoryFromUrl = async (
  client: Client,
  threadId: string,
  url: string
) => {
  try {
    const thread = client.ig.entity.directThread(threadId);
    const imageBuffer = await requestPromise.get({
      url: url,
      encoding: null
    })

    await thread.broadcastStory({
      file: imageBuffer,
    })
  } catch (err) {
    console.log(chalk.red("Message not sent"));
  }
}
export default sendMessage;
