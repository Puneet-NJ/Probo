import express from "express";
import { initilizeRedis } from "./functions/handleSub_Push";
import returnAll from "./controllers/returnAll";
import createUser from "./controllers/createUser";
import createStockSymbol from "./controllers/createStockSymbol";
import getOrderbook from "./controllers/getOrderbook";
import getInrBalances from "./controllers/getInrBalances";
import getStockBalances from "./controllers/getStockBalances";
import getUserBalance from "./controllers/getUserBalance";
import onRamp from "./controllers/onRamp";
import getUserStock from "./controllers/getUserStock";
import buyStock from "./controllers/buyStock";
import sellStock from "./controllers/sellStock";
import getOrderbookForStock from "./controllers/getOrderbookForStock";
import pendingBuyOrders from "./controllers/pendingBuyOrders";
import pendingSellOrders from "./controllers/pendingSellOrders";

const app = express();

app.use(express.json());

initilizeRedis();

app.get("/", returnAll);

app.post("/user/create/:userId", createUser);

app.post("/symbol/create/:stockSymbol", createStockSymbol);

app.get("/orderbook", getOrderbook);

app.get("/balances/inr", getInrBalances);

app.get("/balances/stock", getStockBalances);

// App func
app.get("/balance/inr/:userId", getUserBalance);

app.post("/onramp/inr", onRamp);

app.get("/balance/stock/:userId", getUserStock);

app.post("/order/buy", buyStock);

app.post("/order/sell", sellStock);

app.get("/orderbook/:stockSymbol", getOrderbookForStock);

app.get("/pendingOrders/buy/:userId", pendingBuyOrders);

app.get("/pendingOrders/sell/:userId", pendingSellOrders);

app.listen(4000);
