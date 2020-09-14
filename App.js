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
const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();
const TransferStack = createStackNavigator();
const AddressStack = createStackNavigator();
const MenuStack = createStackNavigator();

import {
  AccountsScreen,
  AccountDetailsScreen,
  ResourceManagementScreen,
  PrivateKeyBackupScreen,
  PrivateKeyDelegateScreen,
  RegisterAddressScreen,
  FIOAddressActionsScreen,
  FIORegisterExternalScreen,
  FIORequestScreen,
  FIORequestDirectScreen,
  ListFIORequestsScreen,
  ViewFIORequestScreen,
  FIOSendScreen,
  FIOSendDirectScreen,
  FIOChatScreen,
  AlgoAccountScreen,
  ConnectAccountScreen,
  CreateTelosAccountScreen,
  AddressBookScreen,
  AddAddressScreen,
  EditAddressScreen,
  TransferScreen,
  TransactionsScreen,
  TransactionDetailScreen,
  VoteScreen,
  MenuScreen,
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
        name="CreateTelosAccount"
        component={CreateTelosAccountScreen}
      />
      <AccountsStack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
      />
      <AccountsStack.Screen
        name="ResourceManagement"
        component={ResourceManagementScreen}
      />
      <AccountsStack.Screen
        name="Vote"
        component={VoteScreen}
      />
      <AccountsStack.Screen
        name="Exchange"
        component={ExchangeScreen}
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
        name="FIORequestDirect"
        component={FIORequestDirectScreen}
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
        name="FIOSendDirect"
        component={FIOSendDirectScreen}
      />
      <AccountsStack.Screen
        name="AlgoAccount"
        component={AlgoAccountScreen}
      />
      <AccountsStack.Screen
        name="FIOChat"
        component={FIOChatScreen}
      />
    </AccountsStack.Navigator>
  );
};

const TransferStackScreen = () => {
  return (
    <TransferStack.Navigator headerMode={'none'}>
      <TransferStack.Screen
        name="Transfer"
        component={TransferScreen}
      />
      <TransferStack.Screen
        name="Transactions"
        component={TransactionsScreen}
      />
      <TransferStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
    </TransferStack.Navigator>
  );
};

const AddressStackScreen = () => {
  return (
    <AddressStack.Navigator headerMode={'none'}>
      <AddressStack.Screen
        name="AddressBook"
        component={AddressBookScreen}
      />
      <AddressStack.Screen
        name="AddAddress"
        component={AddAddressScreen}
      />
      <AddressStack.Screen
        name="EditAddress"
        component={EditAddressScreen}
      />
      <AddressStack.Screen
        name="FIOChat"
        component={FIOChatScreen}
      />
    </AddressStack.Navigator>
  );
};

const MenuStackScreen = () => {
  return (
    <MenuStack.Navigator headerMode={'none'}>
      <MenuStack.Screen name="Menu" component={MenuScreen} />
    </MenuStack.Navigator>
  );
};

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let icon;
    if (route.name === 'Accounts') {
      icon = require('./assets/icons/accounts.png');
    } else if (route.name === 'Transfer') {
      icon = require('./assets/icons/transfer.png');
    } else if (route.name === 'Chat') {
      icon = require('./assets/icons/chat.png');
    } else if (route.name === 'Menu') {
      icon = require('./assets/icons/menu.png');
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
      <MainTab.Screen name={'Transfer'} component={TransferStackScreen} />
      <MainTab.Screen name={'Chat'} component={AddressStackScreen} />
      <MainTab.Screen name={'Menu'} component={MenuScreen} />
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
