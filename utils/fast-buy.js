const axios = require("axios");

const cookie =
  "_uab_collina=165083029395597667537036; _ga=GA1.2.1374921552.1650830346; cf_clearance=GnVUGGzjatwjfbEI_he295syNmDAWOQ.sMx.CRSKhJQ-1655738881-0-150; __cfruid=b1909889a5c4ebde4c8b81be2c22b4ad054bfe56-1655738881; hotbit=ecebd3b087edc8a2537724cf5ca2cc53; _gid=GA1.2.1260470034.1655738889; islogin=true; __cf_bm=N.yzoV1nTvG2eOvsp9SENS.XP.H1G6yJPSU.IqAmRVA-1655760959-0-AZBPdABgdilxxPpiCG7X+QDjkxE+9GDj+L8vxNclk4cz9gAEU/ZBSnNzL+GSLKmZoLuzaFRlh8FGmAtYXrKz+M0MN4kjrlIQRhIR3haiWYSuMxRz9ZCFjSMCvgoaL9Abth5AnbWj6GEDkxIP9BvAHIamGN8HIIT1gK5TXJ8JMfFd; lang=ru-RU";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const dollar = 10;
const createOrder = async (price, coinName) => {
  console.log(price, new Date());
  const orderUrl = "https://www.hotbit.io/v1/order/create?platform=web";

  const buyOrder = `market=${coinName + "/USDT"}&type=LIMIT&side=BUY&price=${(
    price * 1.8
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
    }, 2000);
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
