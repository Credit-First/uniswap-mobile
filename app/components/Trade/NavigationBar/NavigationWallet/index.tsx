import * as React from 'react';

import { toastComingSoon } from '../../../helpers/toastNotification';
import useThemedStyles from '../../../hooks/useThemedStyles';
import i18n from '../../../i18n/i18n';
import { useNavigation } from '../../../navigation/helpers';
import { View } from '../../Themed';
import NavigationItem from '../NavigationItem';
import stylesMain from './styles';

interface IProps {
    currentNavigation: NavigationWalletType;
}

export type NavigationWalletType = 'WALLET' | 'NFTS' | 'REWARDS' | undefined;

const NavigationWallet = ({ currentNavigation }: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const navigation = useNavigation();

    const handleOnWalletPress = () => {
        if (currentNavigation === 'WALLET') {
            return;
        }
        console.log('Navigation wallet');
        navigation.navigateToCoinsWallet();
    };

    const handleOnNFTPress = () => {
        if (currentNavigation === 'NFTS') {
            return;
        }
        console.log('Navigation NFT');
        navigation.navigateToNFTSWallet();
    };

    const handleOnRewardsPress = () => {
        if (currentNavigation === 'REWARDS') {
            return;
        }
        console.log('Navigation rewards');
        navigation.navigateToRewards();
    };

    return (
        <View style={styles.shadow}>
            <View style={styles.container}>
                <NavigationItem
                    onPress={handleOnWalletPress}
                    title={i18n.t('navigationBar.wallet.wallet')}
                    isActive={currentNavigation === 'WALLET'}
                />
                <NavigationItem
                    onPress={handleOnNFTPress}
                    title={i18n.t('navigationBar.wallet.nft')}
                    isActive={currentNavigation === 'NFTS'}
                />
                <NavigationItem
                    onPress={handleOnRewardsPress}
                    title={i18n.t('navigationBar.wallet.rewards')}
                    isActive={currentNavigation === 'REWARDS'}
                />
            </View>
        </View>
    );
};
export default NavigationWallet;
