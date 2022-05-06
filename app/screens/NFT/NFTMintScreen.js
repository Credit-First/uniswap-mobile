import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  KHeader,
  KText,
  TwoIconsButtons,
} from '../../components';
import styles from './NFTMintScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import web3Module, { web3NFTModule } from '../../ethereum/ethereum';

const tokenABI = require('../../ethereum/abi.json');

const NFTMintScreen = props => {
  const [ethBalance, setEthBalance] = useState(0.0);
  const [nftPrice, setNftPrice] = useState(0.0);

  const nativeDivider = 1000000000000000000;
  const [gasPrice, setGasPrice] = useState(0.001);
  const [gasLimit, setGasLimit] = useState(300000);
  const [estimatedFee, setEstimatedFee] = useState(0.0);
  const [totalFee, setTotalFee] = useState(0.0);
  const [pendingMint, setPendingMint] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const {
    getNFTPrice,
    getCurrentNFTMintGasLimit,
    mintNFT,
  } = web3NFTModule();

  const {
    getCurrentGasPrice,
    getBalanceOfAccount,
  } = web3Module({
    tokenABI,
    tokenAddress: null,
    decimals: 18
  });

  const mint = async () => {
    if (pendingMint) {
      Alert.alert(`Waiting for pending mint!`);
      return;
    }
    setPendingMint(true);
    try {
      if (parseFloat(totalFee) > parseFloat(ethBalance)) {
        Alert.alert(`Insufficient balance to buy a Tribe NFT!`);
      }
      else {
        await mintNFT(account.chainName, account, 1, gasLimit, gasPrice);
        Alert.alert(`You bought a Tribe NFT successfully!`);
        goBack();
      }
    } catch (error) {
      console.log("nft mint error:", error)
    }
    setPendingMint(false);
  }

  useEffect(() => {
    const parseInfo = async () => {
      try {
        const price = await getNFTPrice(account.chainName);
        const realNFTPrice = parseFloat(price / nativeDivider).toFixed(4);
        setNftPrice(realNFTPrice);

        const ethBalance = await getBalanceOfAccount(account.chainName, account.address);
        const nativeBalanceInEth = parseFloat(ethBalance / nativeDivider).toFixed(4);
        setEthBalance(nativeBalanceInEth);

        const gasLimitation = await getCurrentNFTMintGasLimit(account.chainName, account, 1);
        setGasLimit(gasLimitation);

        const gasValue = await getCurrentGasPrice(account.chainName);
        setGasPrice(gasValue);

        const estimatedFee = parseFloat((gasValue * gasLimitation) / nativeDivider).toFixed(4);
        setEstimatedFee(estimatedFee);
        
        const realTotalFee = (parseFloat(price / nativeDivider) + parseFloat((gasValue * gasLimitation) / nativeDivider)).toFixed(4);
        setTotalFee(realTotalFee);
      } catch (error) {
        console.log(error)
      }
    }

    if (account) {
      parseInfo();
    }
  }, [account])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
          <KHeader
            title={'Buy an Tribe NFT'}
            style={styles.header}
          />
          <KText>To: {account.address}</KText>
          <KText>NFT price: {nftPrice} {account.chainName}</KText>
          <KText>NFT count: 1</KText>
          <KText>Gas fee: {estimatedFee} {account.chainName} (Estimated)</KText>
          <KText>Total fee: {totalFee} {account.chainName} (Estimated)</KText>
          <KText>Available balance: {ethBalance} {account.chainName}</KText>
          <View style={styles.autoSpacer} />
          <TwoIconsButtons
            onIcon1Press={mint}
            onIcon2Press={goBack}
            icon1={() => (
              <Image
                source={require('../../../assets/icons/confirm.png')}
                style={styles.buttonIcon}
              />
            )}
            icon2={() => (
              <Image
                source={require('../../../assets/icons/close.png')}
                style={styles.buttonIcon}
              />
            )}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(NFTMintScreen);
