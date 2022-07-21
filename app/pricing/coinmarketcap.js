import { log } from '../logger/logger';

const marketAPIKey = '815df99c-3be5-47bd-ba5b-0a9f988178d3';

const getNativeTokenLatestPrices = async () => {
  const reqUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=EOS,TLOS,FIO,ALGO,XLM,ETH,BNB,MATIC,AURORA';
  // Default price values as of Jan 24, 2022
  var defPriceData = {
    'EOS': 2.15,
    'TLOS': 0.5,
    'FIO': 0.1,
    'ALGO': 0.9,
    'XLM': 0.18,
    'ETH': 2350.0,
    'BNB': 400.0,
    'MATIC': 1.7,
    'AURORA': 3.48,
    'TELOSEVM': 0.18,
  };

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
    const ethPrice = resJson['data']['ETH']['quote']['USD']['price'];
    const bnbPrice = resJson['data']['BNB']['quote']['USD']['price'];
    const auroraPrice = resJson['data']['AURORA']['quote']['USD']['price'];
    const maticPrice = resJson['data']['MATIC']['quote']['USD']['price'];
    const newPriceData = {
      'EOS': eosPrice,
      'TLOS': tlosPrice,
      'FIO': fioPrice,
      'ALGO': algoPrice,
      'XLM': xlmPrice,
      'ETH': ethPrice,
      'BNB': bnbPrice,
      'MATIC': maticPrice,
      'AURORA': auroraPrice,
      'TELOSEVM': tlosPrice,
    };
    return newPriceData;
  } catch (err) {
    log({
      description: 'getNativeTokenLatestPrices load error',
      cause: err,
      location: 'coinmarketcap.js',
    });
  }
  return defPriceData;
};

const getAuroraStakingLatestPrices = async () => {
  const reqUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=AURORA,PLY,TRI,BSTN,USN';
  // Default price values as of Jan 24, 2022
  var defPriceData = {
    'AURORA': 1.686,
    'PLY': 0.001157,
    'TRI': 0.03151,
    'BSTN': 0.003835,
    'USN': 0.99,
  };

  try {
    var res = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': marketAPIKey,
      }
    });
    const resJson = await res.json();
    const auroraPrice = resJson['data']['AURORA']['quote']['USD']['price'];
    const plyPrice = resJson['data']['PLY']['quote']['USD']['price'];
    const triPrice = resJson['data']['TRI']['quote']['USD']['price'];
    const bstnPrice = resJson['data']['BSTN']['quote']['USD']['price'];
    const usnPrice = resJson['data']['USN']['quote']['USD']['price'];

    const newPriceData = {
      'AURORA': auroraPrice,
      'PLY': plyPrice,
      'TRI': triPrice,
      'BSTN': bstnPrice,
      'USN': usnPrice,
    };
    return newPriceData;
  } catch (err) {
    log({
      description: 'getAuroraStakingLatestPrices load error',
      cause: err,
      location: 'coinmarketcap.js',
    });
  }
  return defPriceData;
};

export { getNativeTokenLatestPrices, getAuroraStakingLatestPrices };
