import Message, { castMessage } from "./message.js";
import User, { castUser } from "./user.js";

export type Thread = {
  messages: Message[];
  title: string;
  unread: boolean;
  id: string;
  group: boolean;
  userCount: number;
  users: User[]
};

export const castThread = (threadData: any): Thread => {
  var thread: Thread = {
    messages: [],
    title: threadData.thread_title,
    unread: threadData.read_state,
    id: threadData.thread_id,
    group: (threadData.is_group),
    userCount: threadData.users.length,
    users: []
  };
  // reverse order message items
  for (let index = threadData.items.length - 1; index >= 0; index--) {
    let messageData = threadData.items[index]
    let message = castMessage(messageData);
    thread.messages.push(message);
  }
  threadData.users.forEach((userData: any) => {
    let user = castUser(userData)
    thread.users.push(user)
  })
  return thread;
};
export default Thread;
