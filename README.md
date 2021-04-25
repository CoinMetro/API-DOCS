# A repository for documentation of the CoinMetro Crypto Exchange

## REST API

The POSTman documentation of the REST API can be found @ https://documenter.getpostman.com/view/3653795/SVfWN6KS

## Roundings and multipliers

The prices and quantities in the book are rounded to a finite number of digits

**Quantities**
| Currency |  Digits  | Multiplier | 
|----------|----------|------------|
|  EUR     |     3    |     1e3    |
|  USD     |     3    |     1e3    |
|  GBP     |     3    |     1e3    |
|  AUD     |     3    |     1e3    |
|  BTC     |     8    |     1e8    |
|  ETH     |     6    |     1e6    |
|  LTC     |     6    |     1e6    |
|  BCH     |     6    |     1e6    |
|  XCM     |     3    |     1e3    |
|  XRP     |     3    |     1e3    |
|  XLM     |     3    |     1e3    |
|  OMG     |     4    |     1e4    |
|  LINK    |     4    |     1e4    |
|  ENJ     |     4    |     1e4    |
|  BAT     |     4    |     1e4    |
|  PRQ     |     3    |     1e3    |
|  QNT     |     4    |     1e4    |
|  KDA     |     3    |     1e3    |
|  USDC    |     3    |     1e3    |
|  XTZ     |     4    |     1e4    |
|  VXV     |     3    |     1e3    |
|  DNA     |     3    |     1e3    |
|  OCEAN   |     3    |     1e3    |
|  FLUX    |     3    |     1e3    |
|  HTR     |     4    |     1e4    |

**Prices**
|  Pair      |  Digits  | Multiplier | 
|------------|----------|------------|
|  XCMEUR    |     6    |     1e6    |
|  BTCEUR    |     2    |     1e2    |
|  LTCEUR    |     4    |     1e4    |
|  ETHEUR    |     4    |     1e4    |
|  BCHEUR    |     3    |     1e3    |
|  XRPEUR    |     6    |     1e6    |
|  XLMEUR    |     6    |     1e6    |
|  OMGEUR    |     5    |     1e5    |
|  LINKEUR   |     5    |     1e5    |
|  ENJEUR    |     6    |     1e6    |
|  BATEUR    |     6    |     1e6    |
|  QNTEUR    |     4    |     1e4    |
|  PRQEUR    |     6    |     1e6    |
|  USDCEUR   |     5    |     1e5    |
|  XTZEUR    |     4    |     1e4    |
|  KDAEUR    |     5    |     1e5    |
|  OCEANEUR  |     5    |     1e5    |
|  FLUXEUR   |     5    |     1e5    |
|  HTREUR    |     5    |     1e5    |
|  QNTUSD    |     4    |     1e4    |
|  XCMUSD    |     6    |     1e6    |
|  BTCUSD    |     2    |     1e2    |
|  LTCUSD    |     4    |     1e4    |
|  ETHUSD    |     4    |     1e4    |
|  BCHUSD    |     3    |     1e3    |
|  XRPUSD    |     6    |     1e6    |
|  KDAUSD    |     5    |     1e5    |
|  VXVUSD    |     6    |     1e6    |
|  DNAUSD    |     6    |     1e6    |
|  LINKUSD   |     5    |     1e5    |
|  OCEANUSD  |     5    |     1e5    |
|  FLUXUSD   |     5    |     1e5    |
|  LTCBTC    |     6    |     1e6    |
|  ETHBTC    |     6    |     1e6    |
|  XRPBTC    |     8    |     1e8    |
|  QNTBTC    |     6    |     1e6    |
|  BTCGBP    |     2    |     1e2    |
|  ETHGBP    |     4    |     1e4    |
|  XRPGBP    |     6    |     1e6    |
|  XCMETH    |     7    |     1e7    |
|  PRQBETH   |     7    |     1e7    |
|  PRQETH    |     7    |     1e7    |
|  VXVETH    |     7    |     1e7    |
|  DNAETH    |     7    |     1e7    |
|  BTCAUD    |     2    |     1e2    |
|  ETHGBP    |     4    |     1e4    |


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
    "50040.30": 20.14453535,
    "50050.20": 12.00,
    "102300.20": 1,
  }
}
```
The string to checksum will be (bold for readability)

**102300.20**1**50040.30**20.144535351**50050.20**12**50022.01**20.2**50032.01**100

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

## Examples

The folder /examples contains some basic JS examples showing the capabilities of the API. 

All the example are set up to work with the _*demo*_ environment.

*dumb-bot.js*: A bot that sells BTC every few seconds and prints some execution data. When BTC balance goes below a certain threshold, it buys BTC back.  
Demonstrates basic authentication, market order creation, balance polling, fill polling.  
  
*boring-bot.js*: A bot that every few seconds posts 2 limit orders, 2% above and 2% below current price, then prints the book highlighting its own orders.  
Demonstrates price polling, limit order creation, order status polling, order cancellation, basic book polling.

*ws-bot.js*: A bot that connects to the WebSocket, sends and order, then outputs the updates received on the WebSocket.

