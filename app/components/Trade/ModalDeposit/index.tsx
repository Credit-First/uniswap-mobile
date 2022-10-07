import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { WalletContext } from '../../contexts/Wallet/WalletContext';
import useThemedStyles from '../../hooks/useThemedStyles';
import i18n from '../../i18n/i18n';
import AlertWarning from '../AlertWarning';
import ModalBottom from '../ModalBottom';
import QrCodeImage from '../QrCodeImage';
import { Text, View } from '../Themed';
import WalletAddress from '../WalletAddress';
import stylesMain from './styles';

interface IProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    titleText?: string;
    coin?: string;
    secondModal?: boolean;
    modalHeight?: number | string;
}

const ModalDeposit = ({
    isVisible,
    setIsVisible,
    titleText,
    coin,
    secondModal,
    modalHeight = '600px',
}: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const { walletData } = React.useContext(WalletContext);
    const address = walletData?.wallet.address;

    // get modal title
    const title = titleText
        ? titleText
        : coin
        ? i18n.t('wallet.depositBEP', {
              coin: coin,
          })
        : i18n.t('wallet.deposit');

    const handleDepositModalOpen = async () => {
        setIsVisible(false);
    };

    const handleDepositModalClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {address && (
                <ModalBottom
                    visible={isVisible}
                    onClose={handleDepositModalClose}
                    titleText={title}
                    modalHeight={modalHeight}
                    secondModal={secondModal}
                    animation={
                        secondModal
                            ? {
                                  animationIn: 'slideInRight',
                                  animationOut: 'slideOutRight',
                              }
                            : undefined
                    }
                    swipeDirection={
                        secondModal ? ['right', 'up', 'down'] : ['up', 'down']
                    }>
                    <>
                        <View style={styles.topWrapper}>
                            <QrCodeImage link={address} name={coin} />
                            <View style={styles.walletAddressWrapper}>
                                <WalletAddress address={address} />
                            </View>
                        </View>
                        <AlertWarning text={i18n.t('wallet.warning')} />
                    </>
                </ModalBottom>
            )}
        </>
    );
};

export default ModalDeposit;
