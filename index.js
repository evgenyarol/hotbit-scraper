const { getChat, chatHistory } = require("./chat-history");
const db = require("./utils/db");
const { checkLogin } = require("./utils/node-storage");

const run = async () => {
  await chatHistory();
};

const start = async () => {
  await checkLogin();

  // let chat = await db.getChat();

  // if (!chat) {
  //   chat = await getChat();
  //   await db.updateChat(chat);
  // }

  let timerId = setTimeout(function tick() {
    run();
    timerId = setTimeout(tick, 1000);
  }, 100);
};

start();
