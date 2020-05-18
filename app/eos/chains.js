const supportedChains = [
  {
    name: 'EOS',
    symbol: 'EOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.eosrio.io',
    newdexAccount: 'newdexpocket',
  },
  {
    name: 'BOS',
    symbol: 'BOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.bos.eostribe.io',
    newdexAccount: 'newdexwallet',
  },
  {
    name: 'Telos',
    symbol: 'TLOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.telos.eostribe.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'Lynx',
    symbol: 'Lynx',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.lynx.eostribe.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'WAX',
    symbol: 'WAX',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.wax.eostribe.io',
    newdexAccount: 'newdex',
  },
  {
    name: 'DAOBet',
    symbol: 'DAOBet',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.daobet.eostribe.io',
  },
  {
    name: 'MEET.ONE',
    symbol: 'MEETONE',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.meetone.eostribe.io',
    newdexAccount: 'newdex',
  },
];

const getChain = chainName => {
  return supportedChains.find(item => item.name === chainName);
};

export { supportedChains, getChain };
