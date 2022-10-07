import * as React from 'react';

import { User } from '../../../Data/Models';
import BNBIcon from '../../../assets/icons/coins/bnbCoin.svg';
import IGUIcon from '../../../assets/icons/coins/iguCoin.svg';
import IGUPIcon from '../../../assets/icons/coins/igupCoin.svg';
import { WalletBalance } from '../../../contexts/Wallet/WalletHelpers';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { useNavigation } from '../../../navigation/helpers';
import ROUTES from '../../../navigation/routes';
import Button from '../../Button';
import Icon, { ICON_NAMES } from '../../Icons';
import { Text, View } from '../../Themed';
import stylesMain from './styles';

interface IProps {
    user: User | undefined;
    walletBalance: WalletBalance | null;
}

const Wallet = ({ user, walletBalance }: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const navigation = useNavigation();

    const handleCoinsPress = () => {
        navigation.navigateToWallet();
    };

    const handleEnergyPress = () => {
        if (user?.petOrderedIds.length) {
            navigation.navigateToTasks();
        } else {
            navigation.navigate(ROUTES.PLAY);
        }
    };

    return (
        <View style={styles.coinsWrapper}>
            <Button
                containerStyle={styles.gap}
                style={styles.itemPadding}
                size="md"
                type="outline"
                onPress={handleEnergyPress}>
                <View style={styles.energyWrapper}>
                    <View style={styles.item}>
                        <Icon
                            name={ICON_NAMES.ENERGY}
                            size={styles.icon.width}
                        />
                        <Text style={styles.text}>{user?.energy || 0}</Text>
                    </View>
                </View>
            </Button>
            <Button
                size="md"
                type="outline"
                style={styles.itemPadding}
                onPress={handleCoinsPress}>
                <View style={styles.coinWrapper}>
                    <View style={[styles.item, styles.itemGap]}>
                        <BNBIcon
                            width={styles.icon.width}
                            height={styles.icon.height}
                        />
                        <Text style={styles.text}>
                            {walletBalance?.bnb.presentationValueShort ?? '-'}
                        </Text>
                    </View>
                    <View style={[styles.item, styles.itemGap]}>
                        <IGUPIcon
                            width={styles.icon.width}
                            height={styles.icon.height}
                        />
                        <Text style={styles.text}>
                            {walletBalance?.igup.presentationValueShort ?? '-'}
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <IGUIcon
                            width={styles.icon.width}
                            height={styles.icon.height}
                        />
                        <Text style={styles.text}>
                            {walletBalance?.igu.presentationValueShort ?? '-'}
                        </Text>
                    </View>
                </View>
            </Button>
        </View>
    );
};

export default Wallet;
