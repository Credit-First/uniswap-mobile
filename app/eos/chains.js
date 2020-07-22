const supportedChains = [
  {
    name: 'EOS',
    symbol: 'EOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.eosrio.io',
    endpoint2: 'https://eos.greymass.com',
    endpoint3: 'https://api.eossweden.org',
    newdexAccount: 'newdexpocket',
  },
  {
    name: 'BOS',
    symbol: 'BOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.bos.eostribe.io',
    endpoint2: 'https://bos.cryptolions.io',
    endpoint3: 'https://api.bos.eosrio.io',
    newdexAccount: 'newdexwallet',
  },
  {
    name: 'Telos',
    symbol: 'TLOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.telos.eostribe.io',
    endpoint2: 'https://telos.greymass.com',
    endpoint3: 'https://telos.cryptolions.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'WAX',
    symbol: 'WAX',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.wax.eostribe.io',
    endpoint2: 'https://wax.greymass.com',
    endpoint3: 'http://api.wax.alohaeos.com',
    newdexAccount: 'newdex',
  },
  {
    name: 'MEET.ONE',
    symbol: 'MEETONE',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.meetone.eostribe.io',
    endpoint2: 'https://api.meetsweden.org',
    endpoint3: 'https://api.meetone.alohaeos.com',
    newdexAccount: 'newdex',
  },
  {
    name: 'FIO',
    symbol: 'FIO',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'http://fio.eostribe.io',
    endpoint2: 'http://fio.greymass.com',
    endpoint3: 'http://fio.eossweden.org',
    newdexAccount: null,
  },
];

const getChain = chainName => {
  return supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
};

const getAvailableEndpoint = async chainName => {
  console.log('getAvailableEndpoint for '+chainName);
  let chain = supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
  console.log(chain);
  /*
  try {
    let getInfoUrl = chain.endpoint + '/v1/chain/get_info';
    console.log('Checking '+getInfoUrl);
    var result = await fetch(getInfoUrl, { method: 'GET' });
    console.log(result);
    if (result.status == 200 && result.chain_id) {
      return chain.endpoint;
    }
  } catch(err) {
    console.log(err);
  }
  try {
    let getInfoUrl = chain.endpoint2 + '/v1/chain/get_info';
    console.log('Checking '+getInfoUrl);
    var result = await fetch(getInfoUrl, { method: 'GET' });
    console.log(result);
    if (result.status == 200 && result.chain_id) {
      return chain.endpoint2;
    }
  } catch(err) {
    console.log(err);
  }*/
  return chain.endpoint;
}

export { supportedChains, getChain, getAvailableEndpoint };
