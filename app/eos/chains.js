const supportedChains = [
  {
    name: 'EOS',
    symbol: 'EOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.eosrio.io',
    endpoint1: 'https://api.eosrio.io',
    endpoint2: 'https://eos.greymass.com',
    endpoint3: 'https://api.eossweden.org',
    newdexAccount: 'newdexpocket',
  },
  {
    name: 'BOS',
    symbol: 'BOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.bos.eostribe.io',
    endpoint1: 'https://api.bos.eostribe.io',
    endpoint2: 'https://bos.cryptolions.io',
    endpoint3: 'https://api.bos.eosrio.io',
    newdexAccount: 'newdexwallet',
  },
  {
    name: 'Telos',
    symbol: 'TLOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.telos.eostribe.io',
    endpoint1: 'https://api.telos.eostribe.io',
    endpoint2: 'https://telos.greymass.com',
    endpoint3: 'https://telos.cryptolions.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'WAX',
    symbol: 'WAX',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://wax.greymass.com',
    endpoint1: 'https://wax.greymass.com',
    endpoint2: 'http://api.wax.alohaeos.com',
    endpoint3: 'https://api.wax.eostribe.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'MEET.ONE',
    symbol: 'MEETONE',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.meetone.eostribe.io',
    endpoint1: 'https://api.meetone.eostribe.io',
    endpoint2: 'https://api.meetsweden.org',
    endpoint3: 'https://api.meetone.alohaeos.com',
    newdexAccount: 'newdex',
  },
  {
    name: 'FIO',
    symbol: 'FIO',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://fio.greymass.com',
    endpoint1: 'https://fio.greymass.com',
    endpoint2: 'https://fio.eossweden.org',
    endpoint3: 'https://fio.eostribe.io',
    newdexAccount: null,
  },
];

const getChain = chainName => {
  chainName = (chainName.indexOf(' ') >= 0) ? chainName.trim() : chainName;
  return supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
};

const checkEndpoints = async (chain) => {
  try {
    var result = await fetch(chain.endpoint + '/v1/chain/get_info', { method: 'GET' });
    if (result.status !== 200) {
      console.log(chain.endpoint + ' not available!')
      let foundAvailable = false;
      if (chain.endpoint1 !== chain.endpoint) {
        var result1 = await fetch(chain.endpoint1 + '/v1/chain/get_info', { method: 'GET' });
        if (result1.status === 200) {
          chain.endpoint = chain.endpoint1;
          foundAvailable = true;
        }
      }
      if(!foundAvailable && chain.endpoint2 !== chain.endpoint) {
        var result2 = await fetch(chain.endpoint2 + '/v1/chain/get_info', { method: 'GET' });
        if (result2.status === 200) {
          chain.endpoint = chain.endpoint2;
          foundAvailable = true;
        }
      }
      if(!foundAvailable && chain.endpoint3 !== chain.endpoint) {
        var result3 = await fetch(chain.endpoint3 + '/v1/chain/get_info', { method: 'GET' });
        if (result3.status === 200) {
          chain.endpoint = chain.endpoint3;
          foundAvailable = true;
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
};

const getEndpoint = chainName => {
  chainName = (chainName.indexOf(' ') >= 0) ? chainName.trim() : chainName;
  let chain = supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
  checkEndpoints(chain);
  return chain.endpoint;
};

export { supportedChains, getChain, getEndpoint };
