const axios = require("axios");
require("dotenv").config();

(async () => {
  try {
    const token = process.env.TOKEN ||
      (await axios.get("https://api.coinmetro.com/open/demo/temp")).data.token;

    console.log("TOKEN:", token); // Can be reused in .env for persistence
    console.log("THE PARTY IS STARTING IN 10 SECONDS");
    console.log("\n\n------------------\n\n");

    axios.defaults.headers["Authorization"] = `Bearer ${token}`;

    const startTime = Date.now();

    setInterval(async () => {
      try {
        console.log("\n\n------------------\n\n");

        const balances = (await axios.get("https://api.coinmetro.com/open/users/balances")).data;

        console.log("CURRENT BALANCES:\n", balances);

        const order = balances.BTC.BTC < 5
          ? { // BUY BTC
            orderType: "market",
            buyingCurrency: "BTC",
            sellingCurrency: "EUR",
            buyingQty: 3
          }
          : { // SELL BTC
            orderType: "market",
            buyingCurrency: "EUR",
            sellingCurrency: "BTC",
            sellingQty: 0.5
          };

        console.log("SENDING ORDER\n", order);

        console.log("\n\n------------------\n\n");

        console.log("ORDER EXECUTED")
        console.log((await axios.post("https://exchange.coinmetro.com/open/orders/create", order)).data);

        console.log("\n\n------------------\n\n");

        console.log("FILLS SINCE THE BEGINNING OF THIS SESSION");
        console.log((await axios.get(`https://exchange.coinmetro.com/open/fills/${startTime}`)).data);
      } catch (err) {
        console.error("ERROR:\n", err);
        process.exit(1);
      }
    }, 10000);

  } catch (err) {
    console.error("ERROR:\n", err);
  }
})();