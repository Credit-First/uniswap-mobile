import { BigNumber, Overrides, Wallet, ethers } from 'ethers';

import { igu } from '../../Data/erc20.abi';
import { abi } from '../../Data/nft.abi';
import { IBalances } from '../../hooks/useLoadBalances';

export const Coin = {
  bnb: 'BNB',
  igu: 'IGU',
  igup: 'IGUP',
};

export function mapBalances(balances, rates, config) {
  const bnbBalance = balances.bnb;
  const iguBalance = balances.igu;
  const igupBalance = balances.igup;

  return {
    bnb: {
      name: Coin.bnb,
      value: bnbBalance.value,
      presentationValueLong: bnbBalance.valueLong,
      presentationValueShort: bnbBalance.valueShort,
      valueDollars: calculateDollars(bnbBalance.value, rates.bnbusd),
      contractAddress: null,
      exchangeRate: rates.bnbusd,
    },
    igu: {
      name: Coin.igu,
      value: iguBalance.value,
      presentationValueLong: iguBalance.valueLong.toString(),
      presentationValueShort: iguBalance.valueShort,
      valueDollars: calculateDollars(iguBalance.value, rates.iguusd),
      contractAddress: config.iguTokenContractAddress,
      exchangeRate: rates.iguusd,
    },
    igup: {
      name: Coin.igup,
      value: igupBalance.value,
      presentationValueLong: igupBalance.valueLong.toString(),
      presentationValueShort: igupBalance.valueShort,
      valueDollars: calculateDollars(igupBalance.value, rates.igupusd),
      contractAddress: config.igupContractAddress,
      exchangeRate: rates.igupusd,
    },
    nft: {
      name: 'NFTS',
      value: balances.nftsCount,
      tokens: balances.tokens,
      contractAddress: config.nftIguverseContractAddress,
    },
  };
}

export function calculateDollars(value, rate) {
  if (!rate) {
    return '0.0';
  }

  return (Number(value) * Number(rate)).toFixed();
}

export async function sendTransaction(wallet, config, coin, to, amount) {
  const parsedValue = ethers.utils.parseEther(amount);

  switch (coin) {
    case 'BNB':
      const params = {
        from: wallet.address,
        to: to,
        value: parsedValue,
      };
      return await wallet.sendTransaction(params);
    case 'IGU':
      let iguContract = new ethers.Contract(
        config.iguTokenContractAddress,
        igu,
        wallet,
      );
      return await iguContract.transfer(to, parsedValue);
    case 'IGUP':
      let igupContract = new ethers.Contract(
        config.igupContractAddress,
        igu,
        wallet,
      );
      return await igupContract.transfer(to, parsedValue);
  }
  throw 'Undefined coin ' + coin;
}

export async function approveAndExecuteTransaction(
  payment,
  signedTransaction,
  config,
  wallet,
) {
  const transaction = JSON.parse(
    signedTransaction.execTransactionValuesStringified,
  );

  if (payment.token == Coin.igu) {
    const iguContract = new ethers.Contract(
      config.iguTokenContractAddress,
      igu,
      wallet,
    );
    const approveResult = await iguContract.approve(
      signedTransaction.contractAddress,
      payment.amountWei,
    );
    await approveResult.wait(config.mintConfirmationsCount);
  }

  const nftContract = new ethers.Contract(
    config.nftIguverseContractAddress,
    abi,
    wallet,
  );
  const nftResult = await nftContract.execTransaction(...transaction);

  return nftResult;
}
