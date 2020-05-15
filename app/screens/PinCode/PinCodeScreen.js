import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { useFocusEffect } from '@react-navigation/native';

const pinCodeKeychainName = 'keychain-wallet-pincode';

const PinCodeScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState();

  const checkHasPinCode = async () => {
    try {
      const hasCode = await hasUserSetPinCode(pinCodeKeychainName);
      setStatus(hasCode ? 'enter' : 'choose');
      setLoading(false);
    } catch (e) {
      console.log(e);
      setStatus('choose');
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigation.goBack();
  };

  const onBackPress = () => {
    return status === 'enter';
  };

  useEffect(() => {
    checkHasPinCode();
  }, []);

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  if (isLoading) {
    return null;
  }

  return (
    <PINCode
      status={status}
      pinCodeKeychainName={pinCodeKeychainName}
      finishProcess={handleSuccess}
      touchIDDisabled={true}
    />
  );
};

export default PinCodeScreen;
