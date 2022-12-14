import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import styles from './NFTScreen.style';
import { KHeader, KButton, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import NFTSampleURLs, { NFT_COUNT } from './NFTSampleURLs';

const NFTScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [ethAccounts, setEthAccounts] = useState([]);
  const [account, setAccount] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const changeAccount = value => {
    setAccount(value);
  };

  const _handleNFTMint = () => {
    if (account === null) {
      Alert.alert('Please select an account to mint!');
      return;
    }

    navigate('NFTMintScreen', {account});
  }

  useEffect(() => {
    if (accounts) {
      const ethList = accounts.filter((cell) => cell.chainName === 'ETH');
      if (ethList.length === 0) {
        Alert.alert('Please import the Ethereum account or create new one!');
      }
      setEthAccounts(ethList);
    }
  }, [accounts])

  useEffect(() => {
    if(ethAccounts && ethAccounts.length === 1) {
      setAccount(ethAccounts[0]);
    }
  }, [ethAccounts])

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % NFT_COUNT);
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Crypto Tribe NFT'} style={styles.header} />
        <Image
          style={styles.logo}
          source={NFTSampleURLs[imageIndex]}
          resizeMode="contain"
        />
        <View style={styles.spacer} />
        <View style={styles.center}>
          <KText>Sample NFT images</KText>
        </View>
        <KSelect
          label={'Select account'}
          items={ethAccounts.map(item => ({
            label: item.address,
            value: item,
          }))}
          value={account}
          onValueChange={changeAccount}
          containerStyle={styles.inputContainer}
        />
        <View style={styles.spacer} />
        <KButton
          title={'Buy one Tribe NFT'}
          style={styles.button}
          onPress={() => _handleNFTMint()}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(NFTScreen);
