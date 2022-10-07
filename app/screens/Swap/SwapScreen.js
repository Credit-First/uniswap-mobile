/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_BLUE } from '../../theme/colors';
import styles from './SwapScreen.style';
import { KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';

import SettingModal from './components/modal/SettimgModal';
import TokenListModal from './components/modal/TokenListModal';
import TokenFrom from './components/TokenFrom';
import TokenTo from './components/TokenTo';
import ConverIcon from './components/ConvertIcon';
import WalletList from './components/WalletList';
// import { schema } from '@uniswap/token-lists';

import web3Module from '../../ethereum/ethereum';
import { set } from 'react-native-reanimated';
// import { setSharedWebCredentials } from 'react-native-keychain';
// import { fromAscii } from 'ethereumjs-util';
// import { setPropTypes } from 'recompose';

const SwapScreen = props => {
  const defaultToken = {
    chainId: '1',
    tokenAddress: '0xaa000',
    tokeName: 'Ether',
    symbol: 'ETH',
    chainIcon: require('../../../assets/chains/eth.png'),
  };

  const tokenList = [
    {
      chainId: '1',
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      tokeName: 'Ether',
      symbol: 'ETH',
      chainIcon: { uri: 'https://etherscan.io/token/images/ether.png' },
    },
    {
      chainId: '2',
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      tokeName: 'TETHER',
      symbol: 'USDT',
      chainIcon: { uri: 'https://etherscan.io/token/images/tether_32.png' },
    },
    {
      chainId: '3',
      tokenAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      tokeName: 'BNB',
      symbol: 'BNB',
      chainIcon: { uri: 'https://etherscan.io/token/images/bnb_28_2.png' },
    },
    {
      chainId: '4',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      tokeName: 'USD',
      symbol: 'USDC',
      chainIcon: {
        uri: 'https://etherscan.io/token/images/centre-usdc_28.png',
      },
    },
  ];
  const tokenABI = require('../../ethereum/abi.json');
  const tokenAddress = '';
  const {
    createKeyPair,
    getCurrentGasPrice,
    getCurrentETHGasLimit,
    transferETH,
    getBalanceOfAccount,
  } = web3Module({
    tokenABI,
    tokenAddress,
    decimals: 18,
  });

  const [chainName, setChainName] = useState();
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [visibleFromModal, setVisibleFromModal] = useState(false);
  const [visibleToModal, setVisibleToModal] = useState(false);
  const [selectedTokenFrom, setSelectedTokenFrom] = useState(defaultToken);
  const [selectedTokenTo, setSelectedTokenTo] = useState({});
  const [balancesFrom, setBalancesFrom] = useState('0.0');
  const [balancesTo, setBalancesTo] = useState('0.0');
  // const [from, setFrom] = useState({});
  // const [to, setTo] = useState({});
  const [amountFrom, setAmountFrom] = useState();
  const [amountTo, setAmountTo] = useState();
  const [swpBtnState, setSwpBtnState] = useState('0'); //0:select token,1:approve,2:swap

  // const [visibleModal, setVisibleModal] = useState(false);

  const [fromAccount, setFromAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    navigation: { goBack },
    accountsState: { accounts },
  } = props;

  const _handleFromAccountChange = value => {
    if (!chainName) {
      setChainName(value.chainName);
    }
    // const parseInfo = async () => {
    //   const ethBalanceInWei = await getBalanceOfAccount(
    //     chainName,
    //     value.address,
    //   );
    //   const ethBalanceInEth = parseFloat(ethBalanceInWei / ethDivider).toFixed(
    //     4,
    //   );
    //   setEthBalance(ethBalanceInEth);
    // };
    setFromAccount(value);
    // if (value && value.chainName !== 'FIO') {
    //   setAddressInvalidMessage('');
    //   if (
    //     value.chainName === 'ETH' ||
    //     value.chainName === 'BNB' ||
    //     value.chainName === 'MATIC' ||
    //     value.chainName === 'AURORA' ||
    //     value.chainName === 'TELOSEVM'
    //   ) {
    //     parseInfo();
    //   }
    // }
  };
  const getAccountLabel = item => {
    if (
      item.chainName === 'ETH' ||
      item.chainName === 'BNB' ||
      item.chainName === 'MATIC' ||
      item.chainName === 'AURORA' ||
      item.chainName === 'TELOSEVM'
    ) {
      return item.address;
    } else if (item.chainName === 'FIO' || item.chainName === 'XLM') {
      return `${item.chainName}: ${item.address}`;
    } else {
      return `${item.chainName}: ${item.accountName}`;
    }
  };

  const handleSelectToken = (item, type) => {
    if (type === 'From') {
      if (item.symbol === selectedTokenTo.symbol) {
        if (item.symbol === 'ETH') {
          setSelectedTokenTo({});
        } else {
          setSelectedTokenTo(defaultToken);
        }
      }

      setSelectedTokenFrom(item);
      setVisibleFromModal(false);
    } else if (type === 'To') {
      if (item.symbol === selectedTokenFrom.symbol) {
        if (item.symbol === 'ETH') {
          setSelectedTokenFrom({});
        } else {
          setSelectedTokenFrom(defaultToken);
        }
      }
      setSelectedTokenTo(item);
      setVisibleToModal(false);
    }
  };

  const handleAmountFrom = amount => {
    setAmountFrom(amount);
    setBalancesFrom(parseFloat(amount * 1000));
    getAmountTo({
      chainId: selectedTokenFrom.chainId,
      token_address: selectedTokenFrom.tokenAddress,
      amount: amount,
    });
  };

  const handleAmountTo = amount => {
    setAmountTo(amount);
    getAmountFrom({
      chainId: selectedTokenTo.chainId,
      token_address: selectedTokenTo.tokenAddress,
      amount: amount,
    });
    setBalancesTo(parseFloat(amount * 1000));
  };

  const getAmountTo = from => {
    console.log(from, 'from');
  };
  const getAmountFrom = to => {
    console.log(to, 'to');
  };
  React.useEffect(() => {
    if (
      JSON.stringify(selectedTokenFrom) === '{}' ||
      JSON.stringify(selectedTokenTo) === '{}' ||
      !amountFrom ||
      !amountTo
    ) {
      setSwpBtnState('0');
    } else {
      setSwpBtnState('1');
    }
  }, [selectedTokenFrom, selectedTokenTo, amountFrom, amountTo]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcon
          name={'keyboard-backspace'}
          size={24}
          color={PRIMARY_BLUE}
        />
      </TouchableOpacity>

      <View style={styles.inner}>
        <View style={styles.swapContainer}>
          <View style={styles.swapHeader}>
            <KText style={{ fontSize: 20 }}>SWAP</KText>
            <Icon
              name="gears"
              size={20}
              onPress={() => {
                setShowSettingModal(true);
              }}
            />
          </View>
          <View style={styles.swapBody}>
            <WalletList
              style={styles.walletSelect}
              accounts={accounts.map(item => ({
                label: getAccountLabel(item),
                value: item,
              }))}
              handleFromAccountChange={_handleFromAccountChange}
            />
            <TokenFrom
              style={styles.tokenInOut}
              visibleModal={() => {
                setVisibleFromModal(true);
              }}
              title={
                !selectedTokenFrom.symbol
                  ? 'Select Token'
                  : selectedTokenFrom.symbol
              }
              handleAmount={handleAmountFrom}
              // amount={amountFrom}
              balances={balancesFrom}
            />
            <ConverIcon />
            <TokenTo
              style={styles.tokenInOut}
              visibleModal={() => {
                setVisibleToModal(true);
              }}
              title={
                !selectedTokenTo.symbol
                  ? 'Select Token'
                  : selectedTokenTo.symbol
              }
              handleAmount={handleAmountTo}
              // amount={amountTo}
              balances={balancesTo}
            />
          </View>
          <View style={styles.swapFooter}>
            <KButton
              title={
                swpBtnState === '0'
                  ? 'Select a token'
                  : swpBtnState === '1'
                  ? 'Approve'
                  : 'Swap'
              }
              onPress={() => {
                alert('ok');
              }}
              disabled={swpBtnState === '0' ? true : false}
              theme={swpBtnState === '0' ? 'grey' : ''}
            />
          </View>
        </View>
      </View>
      {showSettingModal && (
        <View
          onStartShouldSetResponder={() => setShowSettingModal(false)}
          style={styles.modalContainer}>
          <SettingModal
            isVisible={showSettingModal}
            setSettingModalVisible={isVisible => setShowSettingModal(isVisible)}
          />
        </View>
      )}
      {visibleFromModal && (
        <View
          // onStartShouldSetResponder={() => setVisibleModal(false)}
          style={styles.modalContainer}>
          <TokenListModal
            closeModal={() => setVisibleFromModal(false)}
            type="From"
            tokenList={tokenList}
            // tokenPair={{
            //   from: toSelectedToken,
            //   to: fromSelectedToken,
            // }}
            handleSelectToken={handleSelectToken}
            // value={toTokenValue}
          />
        </View>
      )}
      {visibleToModal && (
        <View
          // onStartShouldSetResponder={() => setVisibleModal(false)}
          style={styles.modalContainer}>
          <TokenListModal
            closeModal={() => setVisibleToModal(false)}
            type="To"
            tokenList={tokenList}
            // tokenPair={{
            //   from: toSelectedToken,
            //   to: fromSelectedToken,
            // }}
            handleSelectToken={handleSelectToken}
            // value={fromTokenValue}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default connectAccounts()(SwapScreen);
