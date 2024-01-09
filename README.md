# A repository for documentation of the CoinMetro Crypto Exchange

**IMPORTANT**: For all further queries and clarifications about the API, to signal what you believe might be an error or an unclear part of the documentation, please contact us through Intercom: https://help.coinmetro.com/en/

## REST API

The POSTman documentation of the REST API can be found @ https://documenter.getpostman.com/view/3653795/SVfWN6KS

## Rate Limiting
Most of our REST API endpoints are rate limited. There are two levels of rate limiting in place: 
- IP based limitng (by cloudflare)
  - At most 500 calls per 10 seconds
- User based limiting, at most:
  - 1 call per 200 ms
    - `/orders/create`
    - `/orders/modify`
  - 1 call per second
    - `/swap`
    - `/swap/confirm/:swapId`
    - `/oauth/token`
    - `/oauth/redirect-uri`
  - 1 call per 5 seconds:
    - `/users/wallets/balance-history`
    - `/ignium/transactions`
    - `/orders/history`
    - `/fills`
    - `/users/wallets/history`
  - 20 calls per 1 minute:
    - `/orders/create`
    - `/orders/modify`
  - 100 calls per 1 minute:
    - `/book`
    - `/candles`
    - `/ticks`
  - 1 call per 1 minute:
    - `/balances`
    - `/webhook/test`
  - 2 calls per 5 minutes:
    - `/verify/email`
    - `/verify/resendemail`
  - 300 calls per 1 hour:
    - `/orders/create`
    - `/orders/modify`
  - 1000 calls per 1 day:
    - `/orders/create`
    - `/orders/modify`

## Roundings and multipliers

The prices and quantities in the book are rounded to a finite number of digits

The most current roundings for all assets are found @ https://api.coinmetro.com/assets

The most current roundings for all pairs are found @ https://api.coinmetro.com/markets

## WebSockets

The WebSockets can be accessed at

`wss://api.coinmetro.com/ws` (live environment)\
`wss://api.coinmetro.com/open/ws` (demo environment)

The connection supports two arguments in the query string

`pairs`: Comma separated list of pairs for which book update subscription is requested\
`token`: JWT token generated through one of the login paths. For long-lived tokens, use `token={deviceId}:{token}`

Both parameters are optional.

Example query string (live environment):

`wss://api.coinmetro.com/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImU3Njk5OTNjIiwiZXhwIjoxNTg2MjgzNzEyNDI1LCJpZCI6IjVlOGNiZGI4OWM5NzQ5MjNjOGNhYWNhZSIsImlwIjoiMTQxLjguNDcuMTIzIiwiaWF0IjoxNTg2MjgxOTEyfQ.XA7tZGwmfRClzlm7SyB9fDfQl-SFKoPnjisOPMtY0sE&pairs=BTCEUR,LTCEUR`

Example query string (demo environment):

`wss://api.coinmetro.com/open/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImU3Njk5OTNjIiwiZXhwIjoxNTg2MjgzNzEyNDI1LCJpZCI6IjVlOGNiZGI4OWM5NzQ5MjNjOGNhYWNhZSIsImlwIjoiMTQxLjguNDcuMTIzIiwiaWF0IjoxNTg2MjgxOTEyfQ.XA7tZGwmfRClzlm7SyB9fDfQl-SFKoPnjisOPMtY0sE&pairs=BTCEUR,LTCEUR`

The WebSockets emit the following messages:

### Order Status Message
It's only received on *authenticated* websockets (i.e. the connection string includes a valid `token` query parameter).

Follows the same format as returned by REST API endpoints
```
{ 
  orderStatus: { 
    orderType: 'market' | 'limit',
    buyingCurrency: string,
    sellingCurrency: string,
    sellingQty: number,
    userID: string,
    orderID: string,
    timeInForce: number, // 1=GTC,2=GTD,2=IOC,3=IOC,4=FOK
    boughtQty: number,
    soldQty: number,
    creationTime: number,
    seqNumber: number,
    firstFillTime: number, // Millisecond since Epoch
    lastFillTime: number, // Millisecond since Epoch
    fills: { 
      seqNumber: number, // Millisecond since Epoch
      timestamp: number, // Millisecond since Epoch
      qty: number,
      price: number,
      side: 'buy' | 'sell'  
    }[],
    completionTime: number, // Millisecond since Epoch
    takerQty: number 
  }
}
```

### Wallet Update Message
It's only received on *authenticated* websockets (i.e. the connection string includes a valid `token` query parameter).

Follows the same format as the `walletHistory` entries in the REST API, additionally the **walletId**, **currency**, **label** and the most current **balance** are indicated
```
{ 
  walletUpdate:{ 
    walletId: string,
    currency: string,
    label: string,
    userId: string,
    description: string,
    amount: number,
    JSONdata: { 
      // Contains data that is specific to the transaction, 
      // e.g. the references for deposit/withdraw operations, 
      // fees for orders, etc
      price: string, // ex. '6730.17 BTC/EUR',
      fees: number,
      notes: string, 
    },
    timestamp: string, // ISODate
    balance: number
  } 
}
```

### Book Update message
It's only received for *subscribed* pairs (i.e. the connection string includes a valid `pairs` query parameter).

Every update includes a CRC32 `checksum` of the book so that it can be verified that the client and the server are in sync. 
The string to be checksummed is generated by concatenating the sorted list of all non-null asks and the list of all non-null bids. 
The sort is in ascending lexicographical order. 


```
CRC32(
      Object.keys(book.ask).filter(p => book.ask[p]).sort().map(p => `${p}${book.ask[p]}`).join("") +
      Object.keys(book.bid).filter(p => book.bid[p]).sort().map(p => `${p}${book.bid[p]}`).join("")
    )
```

It's important to note that the quantities and the prices have to be rounded in a specific way for the checksum calcuation to work properly.

The prices are always expressed with a fixed number of decimals, that depends on the trading pair, see table **Prices**.
The quantities are rounded to a fixed number of digits (see table **Quantities**) and then taken _without trailing zeros_.
The entries with 0 quantities must also be removed.

For example, if we're considering BTCEUR and the `book` object is constituted as follows:
```
{
  pair: "BTCEUR",
  bid: {
    "50032.01": 100.00,
    "50022.01": 20.20,
    },
  ask: {
    "50040.30": 20.144535351,
    "50050.20": 12.00,
    "102300.20": 1,
  }
}
```
The string to checksum will be (bold for readability)

**102300.20**1**50040.30**20.14453535**50050.20**12**50022.01**20.2**50032.01**100

Please see `examples/book-checksum-test.js` for a fully functioning example.

```
{
  bookUpdate: {
    pair: string,
    seqNumber": number,
    ask: {
      [string]: number
      // The keys are price leves, and the values are quantity deltas in the base currency, example
      // 6730.18: -0.15891774,
      // 6721.88: -0.34108226
    },
    bid: {
      [string]: number
      // The keys are price leves, and the values are quantity deltas in the base currency, example
      // 6730.18: -0.15891774,
      // 6721.88: -0.34108226
    }
    checksum: number
   }
}
```

### Tick message
It's received for all pairs, always. Every tick also includes the most current **ask** and **bid**.

```
{
  tick: {
    pair: string,
    price: number,
    qty: number,
    timestamp: number, // Milliseconds since Epoch
    seqNum: number,
    ask: number,
    bid: number
  }
}
```

### New Referral message
It's only received on *authenticated* websockets (i.e. the connection string includes a valid `token` query parameter).

It's received by an affiliate whenever a new user signs up with his refId

```
{
  newReferral: {
    tier: number, // The referral tier, 1 or 2
    refId: string, // The user id of the affiliate receiving the notification 
  }
}
```

## Examples

The folder /examples contains some basic JS examples showing the capabilities of the API. 

All the example are set up to work with the _*demo*_ environment.

*dumb-bot.js*: A bot that sells BTC every few seconds and prints some execution data. When BTC balance goes below a certain threshold, it buys BTC back.  
Demonstrates basic authentication, market order creation, balance polling, fill polling.  
  
*boring-bot.js*: A bot that every few seconds posts 2 limit orders, 2% above and 2% below current price, then prints the book highlighting its own orders.  
Demonstrates price polling, limit order creation, order status polling, order cancellation, basic book polling.

*ws-bot.js*: A bot that connects to the WebSocket, sends and order, then outputs the updates received on the WebSocket.

