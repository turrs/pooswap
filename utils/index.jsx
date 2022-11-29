import axios from "axios";
axios.defaults.headers = {
  "Content-Type": "application/json",
};

const ListToken = axios.create({
  baseURL:
    "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json",
});

const PriceToken = axios.create({
  baseURL: "https://polygon.api.0x.org/swap/v1",
});
const GasPolygon = axios.create({
  baseURL: "https://gasstation-mainnet.matic.network/v2",
});

export { ListToken, PriceToken, GasPolygon };
