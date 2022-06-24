const GateApi = require("gate-api");

const client = new GateApi.ApiClient();

client.setApiKeySecret(process.env.GATE_KEY, process.env.GATE_SECRET);

const createOrder = async (ticker) => {
  const date = new Date();
  const dollar = Number(process.env.DOLLARS);
  const api = new GateApi.SpotApi(client);
  const buyOrder = {
    currencyPair: ticker.currencyPair,
    type: "limit",
    account: "spot",
    side: "buy",
    price: (1.2 * ticker.last).toString(),
    amount: (dollar / ticker.last).toString(),
  };

  const sellOrder = {
    currencyPair: ticker.currencyPair,
    type: "limit",
    account: "spot",
    side: "sell",
    price: (Number(2) * ticker.last).toString(),
    amount: ((dollar / ticker.last) * 0.99).toString(),
  };
  const b = await api.createOrder(buyOrder, () => value);
  setTimeout(async () => {
    const s = await api.createOrder(sellOrder, () => value);
    console.log(b.body, s.body, date);
    process.exit(1);
  }, 2000);
};

const checkPairGate = async (name) => {
  try {
    const api = new GateApi.SpotApi(client);
    const opts = {
      currencyPair: name + "_USDT",
    };
    const s = await api.listTickers(opts, () => value);
    console.log(s);
    await createOrder(s.body[0]);
  } catch (e) {
    console.log("GATE BUY ERROR ", e);
    // if (e.response.data.label === 'INVALID_CURRENCY') {
    //   await checkPairMexc(name, volume);
    // }
  }
};
module.exports = {
  checkPairGate,
};
