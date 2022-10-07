import { useNavigation as useNavigationBase } from '@react-navigation/core';
import { CommonActions, StackActions } from '@react-navigation/native';
import React from 'react';
import { BackHandler } from 'react-native';
import ROUTES from './routes';

export function useNavigation() {
  const navigation = useNavigationBase();

  const replace = (route, params) => {
    navigation.dispatch(StackActions.replace(route, params));
  };

  const resetPreserve = route => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: route }],
      }),
    );
  };

  const blockHardwareBack = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => backHandler.remove();
    }, []);
  };

  const navigateToMint = () => {
    navigation.navigate(ROUTES.MINT_ROOT, {
      screen: ROUTES.MINT_PET_RANKS,
    });
  };

  const navigateToCollection = () => {
    navigation.navigate(ROUTES.COLLECTION);
  };

  const navigateToPlayToEarn = () => {
    navigation.navigate(ROUTES.PLAY_TO_EARN_WELCOME);
  };

  const navigateToPetDetails = pet => {
    navigation.navigate(ROUTES.COLLECTION_DETAILED_PET, {
      pet: pet,
    });
  };

  const navigateToPlay = () => {
    navigation.navigate(ROUTES.PLAY);
  };

  const navigateToTasks = () => {
    navigation.navigate(ROUTES.PLAY_TASKS);
  };

  const navigatePlayEditNFTS = () => {
    navigation.navigate(ROUTES.PLAY_EDIT_NFTS);
  };

  const navigateToWallet = () => {
    navigation.navigate(ROUTES.WALLET_ROOT);
  };

  const navigateToCoinsWallet = () => {
    navigation.navigate(ROUTES.WALLET_COINS_MAIN);
  };

  const navigateToNFTSWallet = () => {
    console.log('Navigate TO NFT Wallet');
    navigation.navigate(ROUTES.WALLET_ROOT, {
      screen: ROUTES.WALLET_NFTS_MAIN,
    });
  };

  const navigateToNFTSWalletWithdraw = pet => {
    navigation.navigate(ROUTES.WALLET_NFTS_WITHDRAW, { pet: pet });
  };

  const navigateToTrade = params => {
    navigation.navigate(ROUTES.WALLET_TRADE_MAIN, params);
  };

  const navigateToWalletSettings = () => {
    navigation.navigate(ROUTES.WALLET_SETTINGS);
  };

  const navigateToProfile = () => {
    navigation.navigate(ROUTES.PROFILE_ROOT);
  };

  const navigateToRewards = () => {
    navigation.navigate(ROUTES.WALLET_REWARDS_MAIN);
  };

  const navigateToPlaySuccess = (
    maxEnergy,
    earnedEnergy,
    petExperienceRewards,
    game,
  ) => {
    navigation.dispatch(
      StackActions.replace(ROUTES.PLAY_TASK_SUCCESS, {
        maxEnergy,
        earnedEnergy,
        petExperienceRewards,
        game,
      }),
    );
  };

  const navigateToDetailedOrganization = charity => {
    navigation.navigate(ROUTES.CHARITY_DETAILED_ORGANIZATION, {
      charity,
    });
  };

  const navigateToAdminView = () => {
    navigation.navigate(ROUTES.ADMIN_ROOT);
  };

  return {
    ...navigation,
    replace,
    resetPreserve,
    blockHardwareBack,
    navigateToMint,
    navigateToCollection,
    navigateToPetDetails,
    navigateToPlay,
    navigateToTasks,
    navigatePlayEditNFTS,
    navigateToWallet,
    navigateToCoinsWallet,
    navigateToNFTSWallet,
    navigateToNFTSWalletWithdraw,
    navigateToTrade,
    navigateToWalletSettings,
    navigateToProfile,
    navigateToRewards,
    navigateToPlayToEarn,
    navigateToPlaySuccess,
    navigateToDetailedOrganization,
    navigateToAdminView,
  };
}
