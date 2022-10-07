import * as React from 'react';

import {
    TokenTransactionType,
    TransactionHistoryTypes,
} from '../../../Data/Models';
import ClaimRewardIcon from '../../../assets/icons/wallet/transactions/claimReward.svg';
import DailyRewardIcon from '../../../assets/icons/wallet/transactions/dailyReward.svg';
import DepositIcon from '../../../assets/icons/wallet/transactions/deposit.svg';
import NftPaymentIcon from '../../../assets/icons/wallet/transactions/nftPayment.svg';
import PaymentIcon from '../../../assets/icons/wallet/transactions/payment.svg';
import ReferralRewardIcon from '../../../assets/icons/wallet/transactions/referralReward.svg';
import WithdrawIcon from '../../../assets/icons/wallet/transactions/withdraw.svg';

interface ITransactionStatusIcon {
    type: TokenTransactionType | TransactionHistoryTypes;
    size?: number;
}

const TransactionStatusIcon: React.FunctionComponent<
    ITransactionStatusIcon
> = ({ type, size = 40 }) => {
    switch (type) {
        case 'DEPOSIT':
            return <DepositIcon width={size} height={size} />;
        case 'WITHDRAW':
            return <WithdrawIcon width={size} height={size} />;
        case 'NFT_PAYMENT':
            return <PaymentIcon width={size} height={size} />;
        case 'MINT':
            return <NftPaymentIcon width={size} height={size} />;
        case 'GameIterationReward':
            return <DailyRewardIcon />;
        case 'ReferralReward':
            return <ReferralRewardIcon />;
        case 'Claim':
            return <ClaimRewardIcon />;
        // PAYMENT
        default:
            return <PaymentIcon width={size} height={size} />;
    }
};

export default TransactionStatusIcon;
