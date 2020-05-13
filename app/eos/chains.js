const supportedChains = [
  {
    name: 'EOS',
    symbol: 'EOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.eosrio.io',
  },
  {
    name: 'Worbli',
    symbol: 'WBI',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.worbli.eostribe.io',
  },
  {
    name: 'BOS',
    symbol: 'BOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.bos.eostribe.io',
  },
  {
    name: 'Telos',
    symbol: 'TLOS',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.telos.eostribe.io',
  },
  {
    name: 'Lynx',
    symbol: 'Lynx',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.lynx.eostribe.io',
  },
  {
    name: 'WAX',
    symbol: 'WAX',
    icon: require('../../assets/chains/eos.png'),
    endpoint: 'https://api.wax.eostribe.io',
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
  },
];

const getChain = chainName => {
  return supportedChains.find(item => item.name === chainName);
};

export { supportedChains, getChain };
