/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { AccountsScreen } from './app/screens';

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

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let icon;
      if (route.name === 'Accounts') {
        icon = require('./assets/icons/accounts.png');
      } else if (route.name === 'Transfer') {
        icon = require('./assets/icons/transfer.png');
      } else if (route.name === 'Vote') {
        icon = require('./assets/icons/vote.png');
      } else if (route.name === 'Transactions') {
        icon = require('./assets/icons/transactions.png');
      } else if (route.name === 'Convert') {
        icon = require('./assets/icons/coins.png');
      }

      return <Image source={icon} style={{ tintColor: color }} />;
    },
  });

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBarOptions={{
          showLabel: false,
        }}>
        <Tab.Screen name={'Accounts'} component={AccountsScreen} />
        <Tab.Screen name={'Transfer'} component={AccountsScreen} />
        <Tab.Screen name={'Vote'} component={AccountsScreen} />
        <Tab.Screen name={'Transactions'} component={AccountsScreen} />
        <Tab.Screen name={'Convert'} component={AccountsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
