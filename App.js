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
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';

import createStore from './app/redux/store';

const store = createStore();

const AccountsStack = createStackNavigator();
const TransactionsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import {
  AccountsScreen,
  ConnectAccountScreen,
  TransferScreen,
  TransactionsScreen,
  TransactionDetailScreen,
  VoteScreen,
} from './app/screens';

const AccountsStackScreen = () => {
  return (
    <AccountsStack.Navigator headerMode={'none'}>
      <AccountsStack.Screen name="Accounts" component={AccountsScreen} />
      <AccountsStack.Screen
        name="ConnectAccount"
        component={ConnectAccountScreen}
      />
    </AccountsStack.Navigator>
  );
};

const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator headerMode={'none'}>
      <TransactionsStack.Screen
        name="Transactions"
        component={TransactionsScreen}
      />
      <TransactionsStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
    </TransactionsStack.Navigator>
  );
};

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
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={screenOptions}
          tabBarOptions={{
            showLabel: false,
          }}>
          <Tab.Screen name={'Accounts'} component={AccountsStackScreen} />
          <Tab.Screen name={'Transfer'} component={TransferScreen} />
          <Tab.Screen name={'Vote'} component={VoteScreen} />
          <Tab.Screen
            name={'Transactions'}
            component={TransactionsStackScreen}
          />
          <Tab.Screen name={'Convert'} component={AccountsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
