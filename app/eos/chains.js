var supportedChains = [
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
    endpoint: 'https://api-za.eostribe.io',
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
    name: 'FIO',
    symbol: 'FIO',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://fio-za.eostribe.io',
    endpoint1: 'https://fio.eosphere.io',
    endpoint2: 'https://fio.genereos.io',
    endpoint3: 'https://fio.greymass.com',
    newdexAccount: null,
  },
];

var fastestEndpoint = [];
var fastestTime = [];

const getChain = chainName => {
  chainName = chainName.indexOf(' ') >= 0 ? chainName.trim() : chainName;
  return supportedChains.find(
    item => item.name === chainName || item.symbol === chainName,
  );
};

const selectFastest = (chain, endpoint, json, sendtime) => {
  if (json && json.chain_id) {
    var calltime = new Date().getTime() - sendtime;
    if (!fastestTime[chain.name]) {
      fastestTime[chain.name] = calltime;
      fastestEndpoint[chain.name] = endpoint;
    } else if (fastestTime[chain.name] > calltime) {
      fastestTime[chain.name] = calltime;
      fastestEndpoint[chain.name] = endpoint;
    }
  }
};

const checkEndpoint = async (chain, endpoint) => {
  try {
    var sendtime = new Date().getTime();
    fetch(endpoint + '/v1/chain/get_info', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => selectFastest(chain, endpoint, json, sendtime))
      .catch(error => console.log(error));
  } catch (err) {
    console.log(endpoint, err);
  }
};

const findFastestEndpoints = async chain => {
  if (chain.endpoint) {
    checkEndpoint(chain, chain.endpoint);
  }
  if (chain.endpoint1) {
    checkEndpoint(chain, chain.endpoint1);
  }
  if (chain.endpoint2) {
    checkEndpoint(chain, chain.endpoint2);
  }
  if (chain.endpoint3) {
    checkEndpoint(chain, chain.endpoint3);
  }
};

supportedChains.map(chain => {
  if (!fastestEndpoint[chain.name]) {
    findFastestEndpoints(chain);
  }
});

const getEndpoint = chainName => {
  chainName = chainName.indexOf(' ') >= 0 ? chainName.trim() : chainName;
  let chain = supportedChains.find(
    item => item.name === chainName || item.symbol === chainName,
  );
  let endpoint = fastestEndpoint[chain.name]
    ? fastestEndpoint[chain.name]
    : chain.endpoint;
  return endpoint;
};

export { supportedChains, getChain, getEndpoint };
