/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connectAccounts } from '../redux';

const AccountsStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const TransferStack = createStackNavigator();
const AddressStack = createStackNavigator();
const NFTStack = createStackNavigator();

import {
  AccountsScreen,
  AccountDetailsScreen,
  TokensScreen,
  TokenDetailsScreen,
  ERC20TokenDetailsScreen,
  TokenImportScreen,
  ResourceManagementScreen,
  BackupAllKeysScreen,
  PrivateKeyBackupScreen,
  PrivateKeyDelegateScreen,
  RegisterFIOAddressScreen,
  FIOAddressActionsScreen,
  FIOAddressRegistryScreen,
  RenewFIOAddressScreen,
  FIORegisterExternalScreen,
  FIORequestScreen,
  FIORequestDirectScreen,
  ListFIORequestsScreen,
  ViewFIORequestScreen,
  FIOSendScreen,
  FIOSendDirectScreen,
  FIOStakeScreen,
  FIOChatScreen,
  GroupChatScreen,
  AlgoAccountScreen,
  StellarAccountScreen,
  EthereumAccountScreen,
  BinanceAccountScreen,
  PolygonAccountScreen,
  ConnectAccountScreen,
  CreateTelosAccountScreen,
  AddressBookScreen,
  AddAddressScreen,
  EditAddressScreen,
  TransferScreen,
  ResendTransferScreen,
  TransactionsScreen,
  VoteScreen,
  MenuScreen,
  NFTScreen,
  NFTMintScreen,
  NFTListScreen,
  AdminScreen,
  RecoverPrivateKeyScreen,
  KeyListScreen,
  ExchangeScreen,
} from './';

const AccountsStackScreen = () => {
  return (
    <AccountsStack.Navigator headerMode={'none'}>
      <AccountsStack.Screen name="Accounts" component={AccountsScreen} />
      <AccountsStack.Screen name="Tokens" component={TokensScreen} />
      <AccountsStack.Screen name="Admin" component={AdminScreen} />
      <AccountsStack.Screen name="RecoverPrivateKey" component={RecoverPrivateKeyScreen} />
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
        name="TokenDetails"
        component={TokenDetailsScreen}
      />
      <AccountsStack.Screen
        name="ERC20TokenDetails"
        component={ERC20TokenDetailsScreen}
      />
      <AccountsStack.Screen
        name="TokenImport"
        component={TokenImportScreen}
      />
      <AccountsStack.Screen
        name="ResourceManagement"
        component={ResourceManagementScreen}
      />
      <AccountsStack.Screen name="Vote" component={VoteScreen} />
      <AccountsStack.Screen name="Exchange" component={ExchangeScreen} />
      <AccountsStack.Screen name="Menu" component={MenuScreen} />
      <AccountsStack.Screen
        name="BackupAllKeys"
        component={BackupAllKeysScreen}
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
        name="RegisterFIOAddress"
        component={RegisterFIOAddressScreen}
      />
      <AccountsStack.Screen
        name="FIOAddressActions"
        component={FIOAddressActionsScreen}
      />
      <AccountsStack.Screen
        name="FIOAddressRegistry"
        component={FIOAddressRegistryScreen}
      />
      <AccountsStack.Screen
        name="RenewFIOAddress"
        component={RenewFIOAddressScreen}
      />
      <AccountsStack.Screen
        name="FIORegisterExternal"
        component={FIORegisterExternalScreen}
      />
      <AccountsStack.Screen name="FIORequest" component={FIORequestScreen} />
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
      <AccountsStack.Screen name="FIOSend" component={FIOSendScreen} />
      <AccountsStack.Screen
        name="FIOSendDirect"
        component={FIOSendDirectScreen}
      />
      <AccountsStack.Screen name="FIOStake" component={FIOStakeScreen} />
      <AccountsStack.Screen name="AlgoAccount" component={AlgoAccountScreen} />
      <AccountsStack.Screen name="StellarAccount" component={StellarAccountScreen} />
      <AccountsStack.Screen name="EthereumAccount" component={EthereumAccountScreen} />
      <AccountsStack.Screen name="BinanceAccount" component={BinanceAccountScreen} />
      <AccountsStack.Screen name="PolygonAccount" component={PolygonAccountScreen} />
      <AccountsStack.Screen name="FIOChat" component={FIOChatScreen} />
      <AccountsStack.Screen name="GroupChat" component={GroupChatScreen} />
      <AccountsStack.Screen name="KeyList" component={KeyListScreen} />
      <AccountsStack.Screen name="NFTListScreen" component={NFTListScreen} />
    </AccountsStack.Navigator>
  );
};

const TransferStackScreen = () => {
  return (
    <TransferStack.Navigator headerMode={'none'}>
      <TransferStack.Screen name="Transfer" component={TransferScreen} />
      <TransferStack.Screen name="ResendTransfer" component={ResendTransferScreen} />
      <TransferStack.Screen
        name="Transactions"
        component={TransactionsScreen}
      />
    </TransferStack.Navigator>
  );
};

const AddressStackScreen = () => {
  return (
    <AddressStack.Navigator headerMode={'none'}>
      <AddressStack.Screen name="AddressBook" component={AddressBookScreen} />
      <AddressStack.Screen name="AddAddress" component={AddAddressScreen} />
      <AddressStack.Screen name="EditAddress" component={EditAddressScreen} />
      <AddressStack.Screen name="FIOChat" component={FIOChatScreen} />
    </AddressStack.Navigator>
  );
};

const NFTStackScreen = () => {
  return (
    <NFTStack.Navigator headerMode={'none'}>
      <NFTStack.Screen name="NFTScreen" component={NFTScreen} />
      <NFTStack.Screen name="NFTMintScreen" component={NFTMintScreen} />
    </NFTStack.Navigator>
  );
};

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let icon;
    if (route.name === 'Accounts') {
      icon = require('../../assets/icons/accounts.png');
    } else if (route.name === 'Transfer') {
      icon = require('../../assets/icons/transfer.png');
    } else if (route.name === 'Chat') {
      icon = require('../../assets/icons/chat.png');
    } else if (route.name === 'NFT') {
      icon = require('../../assets/icons/nft.png');
    }
    return <Image source={icon} style={{ tintColor: color }} />;
  },
});

const MainTabScreen = props => {
  const {
    accountsState: { accounts, nftShowStatus },
    updateNFTShowStatus,
  } = props;

  useEffect(() => {
    const parseInfo = async () => {
      //multi call to get eth balance

    }

    if (accounts && accounts.length > 0) {
      const ethList = accounts.filter((cell) => cell.chainName === 'ETH');
      if (ethList.length > 0) {
        parseInfo(ethList);
      }
      else {
        updateNFTShowStatus(false);
      }
    }
    else {
      updateNFTShowStatus(false);
    }
  }, [accounts])

  return (
    <MainTab.Navigator
      screenOptions={tabScreenOptions}
      tabBarOptions={{
        showLabel: false,
      }}>
      <MainTab.Screen name={'Accounts'} component={AccountsStackScreen} />
      <MainTab.Screen name={'Transfer'} component={TransferStackScreen} />
      <MainTab.Screen name={'Chat'} component={AddressStackScreen} />
      <MainTab.Screen name={'NFT'} component={NFTStackScreen} />
    </MainTab.Navigator>
  );
};

export default connectAccounts()(MainTabScreen);
