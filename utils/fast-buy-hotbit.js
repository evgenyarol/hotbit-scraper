const axios = require("axios");

const cookie =
  "_uab_collina=165083029395597667537036; _ga=GA1.2.1374921552.1650830346; _gid=GA1.2.1260470034.1655738889; islogin=true; hotbit=e55bcc2faea1ff98c4197c8341c6740b; lang=en-US; cf_clearance=x_SviCjsPMyTLzBsAHOB4IjigFJF17F.kF2U19QP5Gs-1655834340-0-150; __cfruid=2e84e362d1e8cc4ceaaf608794b6c97b04f9fee7-1655834340; __cf_bm=wuWSNTvIzJmdkh.lfewNjJPPVJ.y5u7_CCCBRY.x7l0-1655834341-0-Aaou5zJTKAeUbJP/aRNqPnCnaKS3jNDVdOX5XAuXIjSVaLLGZ4FlIu0mFhY09/nBadtlRxVhJETLHnvh8u/bM+g43tJZUTWkvhVuouS9EXTXdxG/ATd5DU4Htz51k6paCFnOWQ4kRf2zQT2tbvbVDxQwetJr6E/Qs0+e9RgMmVGt; _gat_gtag_UA_112252997_1=1";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const dollar = 10;
const createOrder = async (price, coinName) => {
  console.log(price, new Date());
  const orderUrl = "https://www.hotbit.io/v1/order/create?platform=web";

  const buyOrder = `market=${coinName + "/USDT"}&type=LIMIT&side=BUY&price=${(
    price * 1.5
  ).toFixed(3)}&quantity=${(dollar / price).toFixed(2)}`;

  const sellOrder = `market=${coinName + "/USDT"}&type=LIMIT&side=SELL&price=${(
    price * 5
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