import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import styles from './NFTScreen.style';
import { KHeader, KButton, KSelect } from '../../components';
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
    // navigate('Mint');
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
    const interval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % NFT_COUNT );
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
        <KSelect
          label={'Select account'}
          items={ethAccounts.map(item => ({
            label: item.address,
            value: item,
          }))}
          onValueChange={changeAccount}
          containerStyle={styles.inputContainer}
        />
        <View style={styles.spacer} />
        <KButton
          title={'Mint'}
          style={styles.button}
          onPress={() => _handleNFTMint()}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(NFTScreen);
