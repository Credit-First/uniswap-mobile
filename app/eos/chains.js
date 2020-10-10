const supportedChains = [
  {
    name: 'EOS',
    symbol: 'EOS',
    icon: require('../../assets/chains/eos.png'),
    fastest: '',
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
    fastest: '',
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
    fastest: '',
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
    fastest: '',
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
    fastest: '',
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
    fastest: '',
    endpoint: 'https://fio.eostribe.io',
    endpoint1: 'https://fio.eosphere.io',
    endpoint2: 'https://fio.genereos.io',
    endpoint3: 'https://fioapi.nodeone.io',
    endpoint4: 'https://api.fio.eosdetroit.io',
    endpoint5: 'https://fio.greymass.com',
    newdexAccount: null,
  },
];

const getChain = chainName => {
  chainName = (chainName.indexOf(' ') >= 0) ? chainName.trim() : chainName;
  return supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
};

const findFastestEndpoints = async (chain) => {
  try {
    var endpointTimes = [];
    // default endpoint:
    if (chain.endpoint) {
      let endpoint = chain.endpoint;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    // endpoint1:
    if (chain.endpoint1) {
      let endpoint = chain.endpoint1;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    // endpoint2:
    if (chain.endpoint2) {
      let endpoint = chain.endpoint2;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    // endpoint3:
    if (chain.endpoint3) {
      let endpoint = chain.endpoint3;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    // endpoint4:
    if (chain.endpoint4) {
      let endpoint = chain.endpoint4;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    // endpoint5:
    if (chain.endpoint5) {
      let endpoint = chain.endpoint5;
      var sendtime = (new Date()).getTime();
      var result = await fetch(endpoint + '/v1/chain/get_info', { method: 'GET' });
      var calltime = (new Date()).getTime() - sendtime;
      if (result.status === 200) {
        endpointTimes[calltime] = endpoint;
      }
    }
    var smallestTime = 0;
    var fastestEndpoint;
    for (var key in endpointTimes) {
      let time = parseInt(key);
      if(smallestTime == 0) {
        smallestTime = time;
        fastestEndpoint = endpointTimes[key];
      } else if(time < smallestTime) {
        smallestTime = time;
        fastestEndpoint = endpointTimes[key];
      }
    }
    chain.fastest = fastestEndpoint;
  } catch(err) {
    console.log(err);
  }
};

supportedChains.map((chain) => {
  findFastestEndpoints(chain);
});

const getEndpoint = chainName => {
  chainName = (chainName.indexOf(' ') >= 0) ? chainName.trim() : chainName;
  let chain = supportedChains.find(item => (item.name === chainName || item.symbol === chainName));
  findFastestEndpoints(chain);
  let endpoint = (chain.fastest) ? chain.fastest : chain.endpoint;
  return endpoint;
};

export { supportedChains, getChain, getEndpoint };
