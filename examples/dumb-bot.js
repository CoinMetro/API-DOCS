const axios = require("axios");
const chalk = require('chalk');
const readline = require("readline");
require("dotenv").config();

// IMPORTANT: 
// All the API calls are made in the DEMO environment. 
// To use the LIVE environment, drop the /open in the URL, e.g. 
// DEMO                                                   => LIVE 
// https://api.coinmetro.com/open/users/balances          => https://api.coinmetro.com/users/balances
// https://api.coinmetro.com/open/exchange/orders/create  => https://api.coinmetro.com/exchange/orders/create

(async () => {
  try {
    const token = process.env.TOKEN ||
      (await axios.get("https://api.coinmetro.com/open/demo/temp")).data.token;

    console.log(chalk.bold("TOKEN:"), chalk.green(token)); // Can be reused in .env for persistence
    /* Party Lights On - Just 4 Fun - Can Ignore */
    console.log(chalk.bold("THE PARTY IS STARTING IN 10.0 SECONDS\n"));
    const partyStart = Date.now() + 10000;
    const party = setInterval(() => {
      readline.moveCursor(process.stdout, -100, -2);
      readline.clearLine(process.stdout);
      console.log(
        chalk[["red", "green", "yellow", "blue", "magenta", "cyan", "white"][Math.floor(Math.random() * 7)]]
          .bold(`THE PARTY IS STARTING IN ${((partyStart - Date.now()) / 1000).toFixed(1)} SECONDS\n`));
    }, 100);
    setTimeout(() => clearInterval(party), 9900);
    /* Party Lights Off */


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

        console.log(chalk.yellow("SENDING ORDER\n"), order);

        console.log("\n\n------------------\n\n");

        console.log(chalk.green("ORDER EXECUTED\n"), (await axios.post("https://api.coinmetro.com/open/exchange/orders/create", order)).data);

        console.log("\n\n------------------\n\n");

        console.log("FILLS SINCE THE BEGINNING OF THIS SESSION");
        console.log((await axios.get(`https://api.coinmetro.com/open/exchange/fills/${startTime}`)).data);
      } catch (err) {
        console.error("ERROR:\n", err);
        process.exit(1);
      }
    }, 10000);
  } catch (err) {
    console.error("ERROR:\n", err);
  }
})();