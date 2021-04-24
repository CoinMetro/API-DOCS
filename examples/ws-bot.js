const axios = require("axios");
const chalk = require("chalk");
const WS = require("ws");
const readline = require("readline");
require("dotenv").config();

// IMPORTANT: 
// All the API calls are made in the DEMO environment. 
// To use the LIVE environment, drop the /open in the URL, e.g. 
// DEMO                                                   => LIVE 
// https://api.coinmetro.com/open/users/balances          => https://api.coinmetro.com/users/balances
// https://api.coinmetro.com/open/exchange/orders/create  => https://api.coinmetro.com/exchange/orders/create
// wss://api.coinmetro.com/open/ws                        => wss://api.coinmetro.com/ws

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

    const balances = (await axios.get("https://api.coinmetro.com/open/users/balances")).data;

    const ws = new WS(`wss://api.coinmetro.com/open/ws?token=${token}&pairs=BTCEUR`)
    await new Promise(resolve => ws.on("open", resolve));

    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log(chalk.bold("QUERY STRING:"), `wss://api.coinmetro.com/open/ws?token=${token}&pairs=BTCEUR`);

    // Makes sure that sufficient balances are available for operation
    if (balances.BTC.BTC < 1) {
      if (((balances.EUR || {}).EUR || 0) > 15000)
        await axios.post("https://api.coinmetro.com/open/exchange/orders/create", {
          orderType: "market",
          buyingCurrency: "BTC",
          sellingCurrency: "EUR",
          buyingQty: 1
        });
      else throw (Error("Insufficient balances! Please reset your token"));
    }

    const bookUpdates = [];
    const ticks = [];

    ws.on("message", msg => {
      const obj = JSON.parse(msg);
      if (obj.walletUpdate) {
        console.log(chalk.green("WALLET UPDATE\n"), obj, "\n");
      } else if (obj.orderStatus) {
        console.log(chalk.green("ORDER UPDATE\n"), obj, "\n");
      } else if (obj.bookUpdate) {
        bookUpdates.push(obj)
      } else if (obj.tick) {
        ticks.push(obj)
      } else {
        console.error("What is this?", obj)
      }
    });

    const order = { // SELL BTC
      orderType: "market",
      buyingCurrency: "EUR",
      sellingCurrency: "BTC",
      sellingQty: 0.5
    };

    console.log(chalk.yellow("SENDING ORDER\n"), order);

    console.log("\n\n------------------\n\n");

    console.log(chalk.green("\nORDER EXECUTED\n"), (await axios.post("https://api.coinmetro.com/open/exchange/orders/create", order)).data);

    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log(chalk.green("\n\nLAST 5 BTCEUR BOOK UPDATE MESSAGES"))
    bookUpdates.slice(-5).forEach(console.log)

    console.log(chalk.green("\n\nLAST 5 TICK MESSAGES (ALL PAIRS)"))
    ticks.slice(-5).forEach(console.log);

    process.exit();
  } catch (err) {
    console.error("ERROR:\n", err);
  }
})();