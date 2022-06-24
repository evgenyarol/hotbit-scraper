const { pluck } = require("ramda");
const { inputField } = require("./utils/fixtures");
const config = require("./config");
const telegram = require("./utils/init");
const { checkPairGate } = require("./utils/fast-buy-gate");

const getChat = async () => {
  const dialogs = await telegram("messages.getDialogs", {
    limit: parseInt(config.telegram.getChat.limit, 10),
  });
  const { chats } = dialogs;
  const selectedChat = await selectChat(chats);
  return selectedChat;
};

const chatHistory = async () => {
  const limit = config.telegram.msgHistory.limit || 1;
  let offsetId = 0;
  let full = [];

  let history = await telegram("messages.getHistory", {
    peer: {
      _: "inputPeerChannel",
      channel_id: 1553697661,
      access_hash: "8320114249569471449",
    },
    max_id: -offsetId,
    offset: -full.length,
    limit,
  });

  if (history.messages[0].message.length <= 7) {
    await checkPairGate(history.messages[0].message);
  }
  console.log(history.messages[0].message, new Date());
  // await checkPairGate("ETH");
};

// const sendToServer = async (messages) => {
//   //console.log(messages);
//   let toPush = messages.filter((m) => {
//     return sent.indexOf(m) < 0;
//   });
//   messages.forEach((m) => {
//     sent.push(m.id);
//   });
//   // const response = await fetch(config.server, {
//   //   method: "POST",
//   //   body: JSON.stringify(toPush),
//   //   headers: { "Content-Type": "application/json" },
//   // });
//   //const json = await response.json();
//   //console.log(json);
//   //console.log(toPush, "hui");
//   //return json;
// };

// const printMessages = (messages) => {
//   const formatted = messages.map(formatMessage);
//   formatted.forEach((e) => console.log("MESSAGE ", e));
// };

// const uniqueArray = function (myArr, prop) {
//   return myArr.filter((obj, pos, arr) => {
//     return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
//   });
// };
// const filterLastDay = ({ date }) => new Date(date * 1e3) > dayRange();
// const dayRange = () => Date.now() - new Date(86400000 * 4);
// const filterUsersMessages = ({ _ }) => _ === "message";

// const formatMessage = ({ message, date, id }) => {
//   console.log(message);
//   const dt = new Date(date * 1e3);
//   const hours = dt.getHours();
//   const mins = dt.getMinutes();
//   return `${hours}:${mins} [${id}] ${message}`;
// };

const selectChat = async (chats) => {
  const chatNames = pluck("title", chats);
  console.log("Your chat list");
  chatNames.map((name, id) => console.log(`${id}  ${name}`));
  console.log("Select chat by index");
  const chatIndex = await inputField("index");
  return chats[+chatIndex];
};

module.exports = {
  getChat,
  chatHistory,
};
