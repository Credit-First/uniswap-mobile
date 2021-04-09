import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Clipboard,
  Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import QRCode from 'react-native-qrcode-svg';
import styles from './FIORequestSend.style';
import { KHeader, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';


const RenewFIOAddressScreen = props => {
  const [selectedOption, setSelectedOption] = useState();
  const {
    navigation: { navigate, goBack },
    route: {
      params: {
        json,
        fioAccount,
      },
    },
  } = props;

  var paymentOptions = [];

  if (json.success && paymentOptions.length == 0) {
    for (var key in json.success.charge.addresses) {
      var option = {
        "currency": key,
        "address": json.success.charge.addresses[key],
        "price": json.success.charge.pricing[key].amount,
        "ticket": json.success.charge.pricing[key].currency,
      };
      paymentOptions.push(option);
    }
  }

  const setPaymentOption = (currency) => {
    for(var key in paymentOptions) {
      if(currency == paymentOptions[key].currency) {
        setSelectedOption(paymentOptions[key]);
      }
    }
  }

  const getSelectedAddress = () => {
    if (selectedOption && selectedOption.address) {
      return selectedOption.address;
    } else {
      return " ";
    }
  };

  const getSelectedPrice = () => {
    if (selectedOption && selectedOption.price) {
      return selectedOption.price + " " + selectedOption.ticket;
    } else {
      return " ";
    }
  };

  const copyToClipboard = () => {
  	Clipboard.setString(getSelectedAddress());
  	Alert.alert('Address copied to Clipboard!');
  };

  const getCoinbaseLink = () => {
    return json.success.charge.forward_url;
  }

  const gotoCoinbase = () => {
    Linking.openURL(getCoinbaseLink());
  };

  if (paymentOptions.length > 0) {
    // Render UI:
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
              title={'Renew FIO Address'}
              subTitle={fioAccount.address}
              style={styles.header}
            />
            <KSelect
              label={'Select payment method:'}
              items={paymentOptions.map(option => ({
                label: `${option.currency}`,
                value: `${option.currency}`,
              }))}
              onValueChange={setPaymentOption}
              containerStyle={styles.inputContainer}
            />
            <View style={styles.spacer} />
            <View style={styles.qrcode}>
            	<QRCode value={getSelectedAddress()} size={160} onPress={copyToClipboard}/>
            </View>
            <Text>Pay {getSelectedPrice()} to {getSelectedAddress()}</Text>
            <View style={styles.spacer} />
            <Text style={styles.black}>You can either pay to above address.</Text>
            <Text style={styles.link} onPress={gotoCoinbase}>or pay by following this Coinbase link.</Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  } else {
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
              title={'Renew FIO Address'}
              subTitle={fioAccount.address}
              style={styles.header}
            />
            <KText>Unexpected error:</KText>
            <KText>{json}</KText>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }


};

export default connectAccounts()(RenewFIOAddressScreen);
