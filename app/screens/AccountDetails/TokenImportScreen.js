import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  KHeader,
  KLabel,
  KButton,
  KInput,
} from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const tokenABI = require('../../ethereum/abi.json');

const TokenImportScreen = props => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimal, setTokenDecimal] = useState('');

  const {
    navigation: { navigate, goBack },
  } = props;

  const _handleTokenAddressChange = (value) => {
    if (value.indexOf(' ') >= 0) {
      value = value.trim();
    }

    setTokenAddress(value);
  };

  const _handleImportToken = () => {
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={24}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <KHeader
          title='Import Tokens'
          subTitle=''
          style={styles.header}
        />
        <KInput
          label='Token Address'
          placeholder={'Enter token address to import on wallet'}
          value={tokenAddress}
          onChangeText={_handleTokenAddressChange}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KLabel
          title='Token Symbol:'
          subTitle={tokenSymbol}
          style={styles.header}
        />
        <KLabel
          title='Token Decimal:'
          subTitle={tokenDecimal}
          style={styles.header}
        />
        <View style={styles.spacer} />
        <KButton
          title={'Add Custom Token'}
          theme={'blue'}
          style={styles.button}
          onPress={_handleImportToken}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TokenImportScreen);
