const axios = require("axios");

const cookie =
  "_uab_collina=165083029395597667537036; _ga=GA1.2.1374921552.1650830346; islogin=true; lang=en-US; cf_clearance=33k74yu.rwwfkIOvprhNBAkikNgTCGNZtUrJpGrMEqg-1656344740-0-150; __cfruid=4a56ff3fd85e5ceff87c61ebc8ac2bb44abe515c-1656344740; __cf_bm=lxz9pcaHAxBewT0Md2E.9xkCeAnNXZoloSrXkyVI0n4-1656344743-0-AbxFrvLBKHNnnhIecc+I+IUPfHCsgGLehrwpk5EFt7hd85vqT7oTEcPgpFHRRfIl7x11A4GDoOs2GBm18nj/MKe20AyA2/BYWnOgLo7300yBcoojjQGi/BISEaSkpxLpJyE+P9cAgliI9O5wWh0ayVFWkn8xCMbOMOAsASEjKnmM; hotbit=5e7783f2a2640a23eacf3d24de2a6943; _gid=GA1.2.225156144.1656344746; _gat_gtag_UA_112252997_1=1; _gat=1";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const dollar = 5;
const createOrder = async (price, coinName) => {
  console.log(price, new Date());
  const orderUrl = "https://www.hotbit.io/v1/order/create?platform=web";

  const buyOrder = `market=${coinName + "/USDT"}&type=LIMIT&side=BUY&price=${(
    price * 1.3
  ).toFixed(3)}&quantity=${(dollar / price).toFixed(2)}`;

  const sellOrder = `market=${coinName + "/USDT"}&type=LIMIT&side=SELL&price=${(
    price * 1.7
  ).toFixed(3)}&quantity=${(dollar / price).toFixed(2)}`;
  const buy = await axios.post(orderUrl, buyOrder, {
    headers: {
      referer: `https://www.hotbit.io/exchange?symbol=${coinName}_USDT`,
      cookie: cookie,
      "user-agent": userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(buy.data);
  if (buy.data.Code == 1100) {
    setTimeout(async () => {
      const sell = await axios.post(orderUrl, sellOrder, {
        headers: {
          referer: `https://www.hotbit.io/exchange?symbol=${coinName}_USDT`,
          cookie: cookie,
          "user-agent": userAgent,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log(sell.data);
      process.exit(1);
    }, 1500);
  }
};

const checkPair = async (coinName) => {
  try {
    const priceUrl = `https://api.hotbit.io/api/v1/market.last?market=${coinName}/USDT`;
    const { data } = await axios.get(priceUrl, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    await createOrder(data.result, coinName);
  } catch (e) {
    console.log("ERROR ", e);
  }
};

module.exports = {
  checkPair,
};
