/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef } from 'react';
import { Image, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';

import createStore from './app/redux/store';

const store = createStore();

const AccountsStack = createStackNavigator();
const TransactionsStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

import {
  AccountsScreen,
  AccountDetailsScreen,
  PrivateKeyBackupScreen,
  PrivateKeyDelegateScreen,
  RegisterAddressScreen,
  FIOAddressActionsScreen,
  FIORegisterExternalScreen,
  FIORequestScreen,
  ListFIORequestsScreen,
  ViewFIORequestScreen,
  FIOSendScreen,
  AlgoAccountScreen,
  ConnectAccountScreen,
  TransferScreen,
  TransactionsScreen,
  TransactionDetailScreen,
  VoteScreen,
  ExchangeScreen,
  PinCodeScreen,
} from './app/screens';

const AccountsStackScreen = () => {
  return (
    <AccountsStack.Navigator headerMode={'none'}>
      <AccountsStack.Screen name="Accounts" component={AccountsScreen} />
      <AccountsStack.Screen
        name="ConnectAccount"
        component={ConnectAccountScreen}
      />
      <AccountsStack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
      />
      <AccountsStack.Screen
        name="PrivateKeyBackup"
        component={PrivateKeyBackupScreen}
      />
      <AccountsStack.Screen
        name="PrivateKeyDelegate"
        component={PrivateKeyDelegateScreen}
      />
      <AccountsStack.Screen
        name="RegisterAddress"
        component={RegisterAddressScreen}
      />
      <AccountsStack.Screen
        name="FIOAddressActions"
        component={FIOAddressActionsScreen}
      />
      <AccountsStack.Screen
        name="FIORegisterExternal"
        component={FIORegisterExternalScreen}
      />
      <AccountsStack.Screen
        name="FIORequest"
        component={FIORequestScreen}
      />
      <AccountsStack.Screen
        name="ListFIORequests"
        component={ListFIORequestsScreen}
      />
      <AccountsStack.Screen
        name="ViewFIORequest"
        component={ViewFIORequestScreen}
      />
      <AccountsStack.Screen
        name="FIOSend"
        component={FIOSendScreen}
      />
      <AccountsStack.Screen
        name="AlgoAccount"
        component={AlgoAccountScreen}
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

const tabScreenOptions = ({ route }) => ({
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
    } else if (route.name === 'Exchange') {
      icon = require('./assets/icons/coins.png');
    }

    return <Image source={icon} style={{ tintColor: color }} />;
  },
});

const MainTabScreen = () => {
  return (
    <MainTab.Navigator
      screenOptions={tabScreenOptions}
      tabBarOptions={{
        showLabel: false,
      }}>
      <MainTab.Screen name={'Accounts'} component={AccountsStackScreen} />
      <MainTab.Screen name={'Transfer'} component={TransferScreen} />
      <MainTab.Screen name={'Vote'} component={VoteScreen} />
      <MainTab.Screen
        name={'Transactions'}
        component={TransactionsStackScreen}
      />
      <MainTab.Screen name={'Exchange'} component={ExchangeScreen} />
    </MainTab.Navigator>
  );
};

const App = () => {
  const navigationRef = useRef(null);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    navigationRef.current.navigate('PinCode');

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    console.log('App state changed to', nextAppState);
    if (nextAppState === 'active') {
      navigationRef.current.navigate('PinCode');
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <MainStack.Navigator headerMode={'none'}>
          <MainStack.Screen name="MainTab" component={MainTabScreen} />
          <MainStack.Screen
            name="PinCode"
            component={PinCodeScreen}
            options={{ gestureEnabled: false }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
