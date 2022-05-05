import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import styles from './NFTScreen.style';
import { KHeader, KButton, KSelect } from '../../components';
import { connectAccounts } from '../../redux';

const NFTScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [ethAccounts, setEthAccounts] = useState([]);
  const [account, setAccount] = useState('');

  const changeAccount = value => {
    setAccount(value);
  };

  const _handleNFTMint = () => {
    // navigate('Mint');
  }

  useEffect(() => {
    setEthAccounts(accounts.filter((cell) => cell.chainName === 'ETH'))
  }, [accounts])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Crypto Tribe NFT'} style={styles.header} />
        <Image
          style={styles.logo}
          source={require('../../../assets/nft/not-revealed.png')}
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
