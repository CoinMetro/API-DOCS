# A repository for documentation of the CoinMetro Crypto Exchange

## REST API

The POSTman documentation of the REST API can be found @ https://documenter.getpostman.com/view/3653795/SVfWN6KS

## Examples

The folder /examples contains some basic JS examples showing the capabilities of the API.

*dumb-bot.js*: A bot that sells BTC every few seconds and prints some execution data. When BTC balance goes below a certain threshold, it buys BTC back.  
Demonstrates basic authentication, market order creation, balance polling, fill polling.  
  
*boring-bot.js*: A bot that every few seconds posts 2 limit orders, 2% above and 2% below current price, then prints the book highlighting its own orders.  
Demonstrates price polling, limit order creation, order status polling, order cancellation, basic book polling.