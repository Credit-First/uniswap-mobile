import * as SecureStore from 'expo-secure-store';
import { useApolloClient } from '@apollo/client';
import { BigNumber, Wallet, ethers } from 'ethers';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import React from 'react';

import {
  ExchangeRatesOutput,
  ExchangeRatesResponse,
  PaymentOptionOutput,
  SignedTransactionOutput,
  User,
} from '../../Data/Models';
import { GET_EXCHANGES_RATES } from '../../Data/Requests';
import { abi } from '../../Data/nft.abi';
import { feeFormatter } from '../../helpers/wallet';
import useFee, { EstimatedTransactionFee } from '../../hooks/useFee';
import useLoadBalances from '../../hooks/useLoadBalances';
import { ConfigContext } from '../ConfigContext';
import { UserContext } from '../UserContext';
import {
  Coin,
  CoinBalance,
  WalletBalance,
  approveAndExecuteTransaction,
  calculateDollars,
  mapBalances,
  sendTransaction,
} from './WalletHelpers';

export const WalletContext = createContext({
  isLoaded: false,
  walletData: null,
  generate: () => {},
  save: () => {},
  importWallet: wallet => {},
  finalizeAddingProcess: () => {},
  walletBalance: null,
  clearWallet: () => {},
  reloadBalance: silent => {},
  balanceReloading: false,
  fee: null,
  transferNFT: async (address, tokenId) => {
    return {
      transactionFee: '',
      transactionFeeFormatted: '',
      transactionId: '',
      explorerUrl: '',
    };
  },
  transferCoin: async (toAddress, amount, coin) => {
    return {
      transactionFee: '',
      transactionFeeFormatted: '',
      transactionId: '',
      explorerUrl: '',
    };
  },
  executeTransaction: async (payment, signedTransaction) => {
    return {
      transactionFee: '',
      transactionFeeFormatted: '',
      transactionId: '',
      explorerUrl: '',
    };
  },
  // get array of coin balances
  getCoinBalances: () => [],
  priceInUsd: (coin, amount) => '',
});

export const useWallet = () => useContext(WalletContext);

function WALLET_KEY(userId) {
  return 'WALLET_KEY' + userId;
}

const WalletProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const { config } = useContext(ConfigContext);
  const { user, isLoaded: isUserLoaded } = useContext(UserContext);
  const { loadBalances, balances } = useLoadBalances();
  const [provider, setProvider] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [balanceReloading, setBalanceReloading] = useState(false);
  const { fee } = useFee(walletData?.wallet, config);
  const client = useApolloClient();

  // generate wallet during wallet create process
  const generate = useCallback(() => {
    const wallet = provider
      ? Wallet.createRandom().connect(provider)
      : Wallet.createRandom();
    setWalletData({ wallet: wallet, inProcess: true });
  }, [provider]);

  // import wallet during wallet import process
  const importWallet = useCallback(
    wallet => {
      if (provider && user) {
        saveWallet(
          user,
          new Wallet(wallet.privateKey, provider),
          setWalletData,
        );
      }
    },
    [provider, user, setWalletData],
  );

  // save wallet after generation
  const save = useCallback(() => {
    console.log('save ', walletData?.wallet.address);
    if (walletData && user) {
      saveWallet(user, walletData.wallet, setWalletData);
    }
  }, [provider, walletData, setWalletData, user]);

  // mark import/create wallet process completed
  function finalizeAddingProcess() {
    if (walletData) {
      console.log(
        'finalizeAddingProcess:setWalletData: ' + walletData.wallet.address,
      );
      setWalletData({
        wallet: walletData.wallet,
        inProcess: false,
      });
    }
  }

  // map and update balances
  useEffect(() => {
    if (balances && exchangeRates && config) {
      const walletBalance = mapBalances(balances, exchangeRates, config);
      setWalletBalance(walletBalance);
    }
  }, [balances, exchangeRates, config]);

  // reload balances on demand
  const reloadBalance = useCallback(
    async silent => {
      if (walletData && walletData.wallet.provider && config) {
        !silent && setBalanceReloading(true);
        const exchanges =
          client.query <
          ExchangeRatesResponse >
          {
            query: GET_EXCHANGES_RATES,
            fetchPolicy: 'network-only',
          }.then(result => {
            setExchangeRates(result.data.exchangeRates);
          });
        const balances = loadBalances(walletData.wallet, config);
        await Promise.all([exchanges, balances]);
        !silent && setBalanceReloading(false);
      }
      return Promise.resolve();
    },
    [config, walletData],
  );

  // reload balances timer
  useEffect(() => {
    if (!walletData) {
      return;
    }

    reloadBalance(true);
    const interval = setInterval(() => {
      reloadBalance(true);
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [reloadBalance, walletData]);

  // clear wallet from keychain
  function clearWallet() {
    if (user) {
      SecureStore.setItemAsync(WALLET_KEY(user.id), '').then(() => {
        setWalletData(null);
        setWalletBalance(null);
      });
      console.log('Cleared wallet');
    } else {
      console.error("Can't clear wallet as there is no user");
    }
  }

  // update provider when config is loaded
  useEffect(() => {
    if (config) {
      setProvider(
        new ethers.providers.JsonRpcProvider(
          config.rpcPublicProviders[0],
          config.chainId,
        ),
      );
    }
  }, [config]);

  // load wallet from keychain
  useEffect(() => {
    async function loadWallet() {
      setIsLoaded(false);
      console.log('-------loadWallet ' + isUserLoaded + ' ' + config?.chainId);
      if (!isUserLoaded || !provider) {
        return;
      }
      if (user) {
        if (walletData) {
          setIsLoaded(true);
          return;
        }
        const privateKey = await SecureStore.getItemAsync(WALLET_KEY(user.id));
        if (privateKey) {
          const wallet = new Wallet(privateKey, provider);
          console.log('loadWallet:setWalletData: ' + wallet.address);
          setWalletData({ wallet, inProcess: false });
        } else {
          clearWallet();
        }
      } else {
        setWalletData(null);
        setWalletBalance(null);
        console.log('Nullify wallet data');
      }
      setIsLoaded(true);
    }
    loadWallet();
  }, [provider, user, isUserLoaded]);

  // transfer nft to another wallet
  const transferNFT = useCallback(
    async (toAddress, tokenId) => {
      if (!walletData || !config) {
        throw 'Missing wallet or config';
      }
      const { wallet } = walletData;

      const nftContract = new ethers.Contract(
        config.nftIguverseContractAddress,
        abi,
        wallet,
      );
      const result = await nftContract.transferFrom(
        wallet.address,
        toAddress,
        tokenId,
      );
      const transactionResult = await result.wait(
        config.mintConfirmationsCount,
      );

      return mapResult(result, transactionResult, config.blockExplorerURL);
    },
    [walletData, config],
  );

  // transfer coin to another wallet
  const transferCoin = useCallback(
    async (toAddress, amount, coin) => {
      if (!walletData || !config) {
        throw 'Missing wallet or config';
      }

      const result = await sendTransaction(
        walletData.wallet,
        config,
        coin,
        toAddress,
        amount,
      );
      const transactionResult = await result.wait(
        config.mintConfirmationsCount,
      );

      return mapResult(result, transactionResult, config.blockExplorerURL);
    },
    [config, walletData, config],
  );

  const executeTransaction = useCallback(
    async (payment, signedTransaction) => {
      if (!walletData || !config) {
        throw 'Missing wallet or config';
      }
      const result = await approveAndExecuteTransaction(
        payment,
        signedTransaction,
        config,
        walletData.wallet,
      );
      const transactionResult = await result.wait(
        config.mintConfirmationsCount,
      );

      return mapResult(result, transactionResult, config.blockExplorerURL);
    },
    [config, walletData],
  );

  const getCoinBalances = useCallback(() => {
    return walletBalance
      ? [walletBalance.bnb, walletBalance.igu, walletBalance.igup]
      : [];
  }, [walletBalance]);

  const priceInUsd = useCallback(
    (coin, amount) => {
      if (!walletBalance) {
        return '0.0';
      }

      switch (coin) {
        case 'IGUP':
          return calculateDollars(amount, walletBalance.igup.exchangeRate);
        case 'IGU':
          return calculateDollars(amount, walletBalance.igu.exchangeRate);
        case 'BNB':
          return calculateDollars(amount, walletBalance.bnb.exchangeRate);
      }
      return '0.0';
    },
    [walletBalance],
  );

  return (
    <WalletContext.Provider
      value={{
        isLoaded,
        walletData,
        generate,
        save,
        finalizeAddingProcess,
        importWallet,
        reloadBalance,
        balanceReloading,
        walletBalance,
        clearWallet,
        fee,
        transferNFT,
        transferCoin,
        executeTransaction,
        getCoinBalances,
        priceInUsd,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

function saveWallet(user, wallet, setWalletData) {
  SecureStore.setItemAsync(WALLET_KEY(user.id), wallet.privateKey)
    .then(() => {
      console.log('saveWallet:setWalletData: ' + wallet.address);
      setWalletData({
        wallet: wallet,
        inProcess: true,
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function mapResult(result, transactionResult, explorerUrl) {
  const gasPrice = result.gasPrice;
  const gasUsed = transactionResult.gasUsed;
  const transactionId = transactionResult.transactionHash;
  console.log(transactionResult);
  console.log(result);

  const fee = ethers.utils.formatEther(gasPrice.mul(gasUsed));

  console.log('mapResult transactionResult ', fee);
  return {
    transactionFee: fee,
    transactionFeeFormatted: feeFormatter(fee) + ' BNB',
    transactionId: transactionId,
    explorerUrl: explorerUrl + '/tx/' + transactionId,
  };
}

export default WalletProvider;
