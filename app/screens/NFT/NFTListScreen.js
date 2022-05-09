import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './NFTScreen.style';
import { KHeader, KButton, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { web3NFTModule } from '../../ethereum/ethereum';

const NFTListScreen = props => {
  const {
    connectAccount,
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config, nftTokens },
  } = props;

  const {
    getNFTImageURL,
  } = web3NFTModule();

  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    const parseInfo = async () => {
      const list = await Promise.all(
        nftTokens.map(async (cell) => {
          let item = {};
          item.avatarURL = await getNFTImageURL(nftTokens[0].tokenId);
          item.address = cell.address;
          item.isSelected = cell.isSelected;
          return item
        })
      );

      setNftList(list);
    }

    if (nftTokens && nftTokens.length > 0) {
      parseInfo();
    }
    else {
      Alert.alert("You have no Tribe NFTs in your ethereum wallets!")
    }
  }, [nftTokens])

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
          <KHeader title={'My NFTs'} style={styles.header} />
          {nftList && nftList.map((cell) => {
            <View>
              <Image
                style={styles.logo}
                source={cell.avatarURL}
                resizeMode="contain"
              />
              <KText>{cell.address}</KText>
              <View style={styles.spacer} />
            </View>

          })}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(NFTListScreen);
