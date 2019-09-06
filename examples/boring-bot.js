const axios = require("axios");
const chalk = require("chalk");
require("dotenv").config();

(async () => {
  try {
    const token = process.env.TOKEN ||
      (await axios.get("https://api.coinmetro.com/open/demo/temp")).data.token;

    console.log("TOKEN:", token); // Can be reused in .env for persistence
    console.log("THE PARTY IS STARTING IN 10 SECONDS");
    console.log("\n\n------------------\n\n");

    axios.defaults.headers["Authorization"] = `Bearer ${token}`;

    const balances = (await axios.get("https://api.coinmetro.com/open/users/balances")).data;

    // Makes sure that sufficient balances are available for operation
    if (balances.BTC.BTC < 1 || ((balances.EUR || {}).EUR || 0) < 10000) {
      if (((balances.EUR || {}).EUR || 0) > 15000)
        await axios.post("https://exchange.coinmetro.com/open/orders/create", {
          orderType: "market",
          buyingCurrency: "BTC",
          sellingCurrency: "EUR",
          buyingQty: 1
        });
      else if (balances.BTC.BTC > 2)
        await axios.post("https://exchange.coinmetro.com/open/orders/create", {
          orderType: "market",
          buyingCurrency: "EUR",
          sellingCurrency: "BTC",
          buyingQty: 10000
        });
      else throw (Error("Insufficient balances! Please reset your token"));
    }

    setInterval(async () => {
      try {
        console.log("\n\n------------------\n\n");

        // Lists currently pending orders
        const activeOrders = (await axios.get("https://exchange.coinmetro.com/open/orders/active")).data;

        // Cancels pending orders
        for (const order of activeOrders) {
          const cancel = (await axios.put(`https://exchange.coinmetro.com/open/orders/cancel/${order.orderID}`)).data;
          console.log("ORDER CANCELED", { orderID: cancel.orderID, completionTime: cancel.completionTime });
        }
        
        console.log("\n\n------------------\n\n");

        // Polls latest prices
        const prices = (await axios.get("https://exchange.coinmetro.com/open/prices")).data;

        const BTCEUR = prices.latestPrices.find(price => price.pair == "BTCEUR");
        console.log("CURRENT BTCEUR PRICE:\n", BTCEUR);
        
        console.log("\n\n------------------\n\n");

        // Calculates new orders based on latest prices
        const longPrice = BTCEUR.price * 0.98;
        const longOrder = {
          orderType: "limit",
          buyingCurrency: "BTC",
          sellingCurrency: "EUR",
          buyingQty: 0.1,
          sellingQty: 0.1 * longPrice
        };

        const shortPrice = BTCEUR.price * 1.02;
        const shortOrder = {
          orderType: "limit",
          buyingCurrency: "EUR",
          sellingCurrency: "BTC",
          sellingQty: 0.1,
          buyingQty: 0.1 * shortPrice
        }

        console.log("ORDER ACCEPTED\n", (await axios.post("https://exchange.coinmetro.com/open/orders/create", longOrder)).data);
        console.log("ORDER ACCEPTED\n", (await axios.post("https://exchange.coinmetro.com/open/orders/create", shortOrder)).data);

        const book = (await axios.get("https://exchange.coinmetro.com/open/book/BTCEUR")).data.book;

        const shortPriceRounded = shortPrice.toFixed(2); // BTCEUR prices are rounded to 2 decimal digits
        const sortedAsk = Object.keys(book.ask).sort((a, b) => a - b);
        const bookPosAsk = sortedAsk.indexOf(shortPriceRounded);

        const longPriceRounded = longPrice.toFixed(2); // BTCEUR prices are rounded to 2 decimal digits
        const sortedBid = Object.keys(book.bid).sort((a, b) => b - a);
        const bookPosBid = sortedBid.indexOf(longPriceRounded);

        console.log("\n\n------------------\n\n");

        console.log("BOOK\n");

        for (const askPrice of sortedAsk.slice(0, bookPosAsk + 3).reverse()) {
          const askLevel = `${askPrice.padStart(10)}\t${book.ask[askPrice].toString().padStart(15)}`;
          if (askPrice == shortPriceRounded) console.log(chalk.red(askLevel));
          else console.log(askLevel);
        }

        console.log();

        for (const bidPrice of sortedBid.slice(0, bookPosBid + 3)) {
          const bidLevel = `${bidPrice.padStart(10)}\t${book.bid[bidPrice].toString().padStart(15)}`;
          if (bidPrice == longPriceRounded) console.log(chalk.green(bidLevel));
          else console.log(bidLevel);
        }
      } catch (err) {
        console.error("ERROR:\n", err);
        process.exit(1);
      }
    }, 10000);

  } catch (err) {
    console.error("ERROR:\n", err);
  }
})();