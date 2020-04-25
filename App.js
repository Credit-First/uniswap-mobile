/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';

const App = () => {
  useEffect(() => {
    checkPinCode();
  }, []);

  const checkPinCode = async () => {
    try {
      const res = await hasUserSetPinCode();
      console.log('has pin code', res);
    } catch (e) {
      console.log('pin code error', e);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <PINCode status={'locked'} />
      </SafeAreaView>
    </>
  );
};

export default App;
