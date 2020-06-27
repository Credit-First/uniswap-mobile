const externalChains = [
  {
    chain_code: 'BTC',
    token_code: 'BTC',
    explorer: 'https://btc.com/',
  },
  {
    chain_code: 'ETH',
    token_code: 'ETH',
    explorer: 'https://etherscan.io/address/',
  },
  {
    chain_code: 'BCH',
    token_code: 'BCH',
    explorer: 'https://explorer.bitcoin.com/bch/address/',
  },
  {
    chain_code: 'LTC',
    token_code: 'LTC',
    explorer: 'https://live.blockcypher.com/ltc/address/',
  },
];

const getExternalChain = chainName => {
  return externalChains.find(item => item.chain_code === chainName);
};

export { externalChains, getExternalChain };