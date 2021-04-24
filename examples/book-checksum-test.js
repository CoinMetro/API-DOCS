const { str: CRC32 } = require("crc-32")
const WebSocket = require("ws")
const fetch = require("node-fetch");
const _ = require("lodash");

const pairs = ["BTCGBP", "BTCEUR", "ETHEUR", "ETHGBP", "LTCEUR", "LTCGBP", "BCHEUR", "BCHGBP", "XRPEUR", "XRPGBP"];

const books = {
    BTCGBP: null,
    BTCEUR: null,
    ETHEUR: null,
    ETHGBP: null,
    LTCEUR: null,
    LTCGBP: null,
    BCHEUR: null,
    BCHGBP: null,
    XRPEUR: null,
    XRPGBP: null
}

const updatingBook = {
    BTCGBP: false,
    BTCEUR: false,
    ETHEUR: false,
    ETHGBP: false,
    LTCEUR: false,
    LTCGBP: false,
    BCHEUR: false,
    BCHGBP: false,
    XRPEUR: false,
    XRPGBP: false
}

multipliers = {
    BTC: 1e8,
    ETH: 1e6,
    LTC: 1e6,
    BCH: 1e6,
    XCM: 1e3,
    XRP: 1e3,
    XLM: 1e3,
    OMG: 1e4,
    LINK: 1e4,
    ENJ: 1e4,
    BAT: 1e4,
    PRQ: 1e3,
    QNT: 1e4,
    IGN: 1e3,
    KDA: 1e3,
    USDC: 1e3,
    XTZ: 1e4,
    PRQB: 1e3,
    VXV: 1e3,
    DNA: 1e3,
    OCEAN: 1e3,
    FLUX: 1e3,
    HTR: 1e4,

    EUR: 1e3,
    GBP: 1e3,
    USD: 1e3,
    AUD: 1e3,
}

const roundTo = (n, rounding) => Math.round(n * rounding) / rounding;

const applyBookUpdate = (book, bookUpdate) => {
    if (book.seqNumber >= bookUpdate.seqNumber) return book;

    const rounding = multipliers[book.pair.slice(0, -3)];
    for (const p in bookUpdate.ask) {
        book.ask[p] = roundTo((book.ask[p] || 0) + bookUpdate.ask[p], rounding);
        if (book.ask[p] <= 0) delete book.ask[p];
        book.askSeqNumber = Math.max(bookUpdate.seqNumber, book.askSeqNumber || 0);
    }
    for (const p in bookUpdate.bid) {
        book.bid[p] = roundTo((book.bid[p] || 0) + bookUpdate.bid[p], rounding);
        if (book.bid[p] <= 0) delete book.bid[p];
        book.bidSeqNumber = Math.max(bookUpdate.seqNumber, book.bidSeqNumber || 0);
    }
    book.seqNumber = Math.max(bookUpdate.seqNumber, book.seqNumber);

    return book;
};

// These symbols, - : |, are only applied to aid readability, 
// They're removed before calculating the checksum, see line 150
const bookChecksumString = book =>
    Object.keys(book.ask)
        .sort()
        .map(p => `${p}:${book.ask[p]}`)
        .join("-") +
    "|" +
    Object.keys(book.bid)
        .sort()
        .map(p => `${p}:${book.bid[p]}`)
        .join("-");

let updates = 0;
let resets = 0;

const bookUpdates = [];

const fetchBook = (pair) => {
    updatingBook[pair] = true;
    fetch(`https://api.coinmetro.com/exchange/book/${pair}`)
        .then(res => res.json())
        .then(res => {
            books[pair] = res.book;
            console.log({ newBook: _.omit(books[pair], "bid", "ask") });
            const bookUpdate = bookUpdates.find(bU => bU.seqNumber === books[pair].seqNumber)
            if (bookUpdate) console.log({ bookUpdate: _.omit(bookUpdate, "bid", "ask") });
            updatingBook[pair] = false;
        });
}

const ws = new WebSocket(`wss://api.coinmetro.com/ws?pairs=${pairs.join()}`)
ws.onmessage = e => {
    data = JSON.parse(e.data);
    const bookUpdate = data.bookUpdate;
    // Add update to the queue of updates
    if (bookUpdate)
        if (pairs.includes(bookUpdate.pair))
            bookUpdates.push(bookUpdate)
}

setInterval(() => console.log({ updates, resets, ratio: updates / resets }), 5000);

pairs.forEach(fetchBook);

const applyNextUpdate = () => {

    // Sort updates and apply the one with lowest seqNumber first
    bookUpdates.sort((a, b) => a.seqNumber - b.seqNumber);
    const bookUpdate = bookUpdates[0];
    if (!bookUpdate) return setImmediate(applyNextUpdate);
    const { pair, seqNumber } = bookUpdate;

    // If book is updating, do not remove the first entry and repeat
    if (!books[pair] || updatingBook[pair]) return setImmediate(applyNextUpdate);
    bookUpdates.shift();

    // If book is more recent than the bookUpdate, skip the update
    if (books[pair].seqNumber >= seqNumber)
        return setImmediate(applyNextUpdate);

    books[pair] = applyBookUpdate(books[pair], bookUpdate);
    updates++;
    const checksumString = bookChecksumString(books[pair]);
    const checksum = CRC32(checksumString.replace(/[|:-]/g, ""));
    // console.log(pair, bookUpdate.seqNumber);
    if (checksum !== bookUpdate.checksum) {
        resets++;
        console.log(
            "CHECKSUM FAILED!",
            {
                receivedChecksum: bookUpdate.checksum,
                checksum,
                checksumString,
                seqNumber,
                book: _.omit(books[pair], "bid", "ask"),
                bookUpdate: _.omit(bookUpdate, "bid", "ask")
            })
        fetchBook(pair);
    }
    if (!(updates % 1000))
        console.log(
            "CHECKSUM OK!",
            {
                receivedChecksum: bookUpdate.checksum,
                checksum,
                checksumString,
                seqNumber,
                book: books[pair],
                bookUpdate
            })
    // else console.log("OK", books[pair].seqNumber, pair, checksum, checksumString)
    setImmediate(applyNextUpdate);
}

applyNextUpdate();
