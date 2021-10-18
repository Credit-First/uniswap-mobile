import { log } from '../logger/logger';

const reqUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=EOS,TLOS,FIO,ALGO,XLM';
const marketAPIKey = '815df99c-3be5-47bd-ba5b-0a9f988178d3';
// Default price values as of Sep 19, 2021
var defPriceData = {
  'EOS': 5.0,
  'TLOS': 0.9,
  'FIO': 0.2,
  'ALGO': 1.8,
  'XLM': 0.40
};

const getLatestPrices = async () => {
  try {
    var res = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': marketAPIKey,
      }
    });
    const resJson = await res.json();
    const eosPrice = resJson['data']['EOS']['quote']['USD']['price'];
    const tlosPrice = resJson['data']['TLOS']['quote']['USD']['price'];
    const fioPrice = resJson['data']['FIO']['quote']['USD']['price'];
    const algoPrice = resJson['data']['ALGO']['quote']['USD']['price'];
    const xlmPrice = resJson['data']['XLM']['quote']['USD']['price'];
    const newPriceData = {
      'EOS': eosPrice,
      'TLOS': tlosPrice,
      'FIO': fioPrice,
      'ALGO': algoPrice,
      'XLM': xlmPrice
    };
    return newPriceData;
  } catch (err) {
    log({
      description: 'getLatestPrices load error',
      cause: err,
      location: 'coinmarketcap.js',
    });
  }
  return defPriceData;
};

export { getLatestPrices };
