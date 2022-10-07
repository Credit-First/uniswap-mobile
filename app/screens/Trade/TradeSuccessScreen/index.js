import * as React from 'react';

import CheckoutSuccessScreen from '../../../components/Trade/c';
import CheckoutSuccessScreen from '../../../../components/CheckoutSuccessScreen';
import TransactionSummary from '../../../../components/TransactionSummary';
import i18n from '../../../../i18n/i18n';
import { useNavigation } from '../../../../navigation/helpers';
import ROUTES from '../../../../navigation/routes';
import { TradeSuccessProps } from '../../../../types';

const TradeSuccessScreen = ({ route }: TradeSuccessProps) => {
    const navigation = useNavigation();
    const { estimate, from, to, fee, totalSummary, explorerUrl, balance } =
        route.params;

    const handleViewTransactionsHistory = () => {
        navigation.navigate(ROUTES.WALLET_COINS_BALANCE, { balance });
    };

    const handleBackToWallet = () => {
        navigation.pop();
        navigation.navigateToCoinsWallet();
    };

    navigation.blockHardwareBack();

    const renderTransactionDetailComponent = () => {
        let fromKey, toKey;
        console.log('estimate: ', estimate);
        if (estimate === 'from') {
            fromKey =
                i18n.t('trade.tradeSuccess.from') +
                ' ' +
                i18n.t('trade.tradeSuccess.estimate');
            toKey = i18n.t('trade.tradeSuccess.to');
        } else {
            toKey =
                i18n.t('trade.tradeSuccess.to') +
                ' ' +
                i18n.t('trade.tradeSuccess.estimate');
            fromKey = i18n.t('trade.tradeSuccess.from');
        }
        return (
            <>
                <TransactionSummary
                    values={[
                        {
                            key: fromKey,
                            value: from,
                        },
                        {
                            key: toKey,
                            value: to,
                        },
                        {
                            key: i18n.t('trade.tradeSuccess.blockchainFee'),
                            value: fee,
                        },
                        {
                            key: i18n.t('trade.tradeSuccess.totalSummary'),
                            value: totalSummary,
                        },
                    ]}
                />
            </>
        );
    };

    return (
        <>
            <CheckoutSuccessScreen
                title={i18n.t('trade.tradeSuccess.title')}
                text={i18n.t('trade.tradeSuccess.text')}
                onPressButtonMain={handleBackToWallet}
                buttonMainText={i18n.t('trade.tradeSuccess.backToWallet')}
                onPressButtonAdditional={handleViewTransactionsHistory}
                buttonAdditionalText={i18n.t(
                    'trade.tradeSuccess.viewTransactionHistory'
                )}
                TransactionDetailsComponent={renderTransactionDetailComponent()}
                explorerUrl={explorerUrl}
            />
        </>
    );
};

export default TradeSuccessScreen;
