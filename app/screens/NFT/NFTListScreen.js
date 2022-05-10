import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, TouchableOpacity, Alert, CheckBox, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './NFTScreen.style';
import { KHeader, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { web3NFTModule } from '../../ethereum/ethereum';

const NFTListScreen = props => {
  const {
    connectAccount,
    navigation: { navigate, goBack },
    selectNFTToken,
    accountsState: { accounts, addresses, keys, totals, history, config, nftTokens },
  } = props;

  const {
    getNFTImageURL,
  } = web3NFTModule();

  const [nftList, setNftList] = useState([]);

  const handleSelected = (index) => {
    selectNFTToken(index);
  }

  useEffect(() => {
    const parseInfo = async () => {
      const list = await Promise.all(
        nftTokens.map(async (cell, index) => {
          let item = {};
          item.avatarURL = await getNFTImageURL(nftTokens[index].tokenId);
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
        <SafeAreaView style={styles.inner}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
          <KHeader title={'My NFTs'} style={styles.header} />
          <FlatList
            data={nftList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.nftContainer}>
                <Image
                  style={styles.logo}
                  source={item.avatarURL}
                  resizeMode="contain"
                />
                <View style={styles.selectContainer}>
                  <KText>{`${item.address.substring(0, 10)}...${item.address.substring(item.address.length - 10, item.address.length)}`}</KText>
                  <CheckBox
                    title="Select here"
                    value={item.isSelected}
                    onValueChange={() => handleSelected(index)}
                    style={styles.checkbox}
                  />
                </View>
                <View style={styles.spacer} />
              </View>
            )}
          />
        </SafeAreaView>
    </SafeAreaView>
  );
};

export default connectAccounts()(NFTListScreen);
