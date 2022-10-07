import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleProp, ViewProps } from 'react-native';

import ButtonsBottom from '../../../components/Trade/ButtonsBottom';
import ButtonsBottom from '../../components/ButtonsBottom';
import { useLottieAssets } from '../../contexts/LottieAssetsContext';
import { WalletContext } from '../../contexts/Wallet/WalletContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import Button from '../Button';
import { ComponentType } from '../CheckoutScreen/types';
import Divider from '../Divider';
import ExplorerLink from '../ExplorerLink';
import ImageSequences from '../ImageSequences';
import { Text, View } from '../Themed';
import stylesMain from './styles';

interface IProps {
    title: string;
    text: string;
    buttonMainText: string;
    buttonAdditionalText?: string;
    TransactionDetailsComponent?: ComponentType;
    explorerUrl?: string;
    onPressButtonMain: () => void;
    onPressButtonAdditional?: () => void;
    containerStyle?: StyleProp<ViewProps>;
}

const CheckoutSuccessScreen = ({
    title,
    text,
    buttonMainText,
    buttonAdditionalText,
    TransactionDetailsComponent,
    explorerUrl,
    onPressButtonMain,
    onPressButtonAdditional,
    containerStyle,
}: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const { dancingAsset } = useLottieAssets();
    const { reloadBalance } = useContext(WalletContext);

    const handlePressButtonMain = () => {
        reloadBalance(true);
        onPressButtonMain();
    };

    const handlePressButtonAdditional = () => {
        reloadBalance(true);
        if (onPressButtonAdditional) {
            onPressButtonAdditional();
        }
    };

    return (
        <SafeAreaView style={[styles.safe, containerStyle]}>
            <ScrollView>
                <View style={styles.imageWrapper}>
                    {dancingAsset && <ImageSequences source={dancingAsset} />}
                </View>

                <View style={styles.textWrapper}>
                    <Text style={[styles.title, styles.align]}>{title}</Text>
                    <Text style={[styles.text, styles.align]}>{text}</Text>
                </View>

                <View style={styles.container}>
                    <View style={styles.transactionDetailsWrapper}>
                        {TransactionDetailsComponent}
                        {!!explorerUrl && (
                            <ExplorerLink
                                explorerUrl={explorerUrl}
                                containerStyles={styles.explorerLinkContainer}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
            <ButtonsBottom
                onPress={handlePressButtonMain}
                title={buttonMainText}>
                {/* Additional button if exists */}
                {onPressButtonAdditional && (
                    <View style={styles.additionalButton}>
                        <Button
                            type="outline"
                            onPress={handlePressButtonAdditional}
                            title={buttonAdditionalText}
                        />
                    </View>
                )}
            </ButtonsBottom>
        </SafeAreaView>
    );
};

export default CheckoutSuccessScreen;
