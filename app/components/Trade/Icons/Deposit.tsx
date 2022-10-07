import * as React from 'react';

import DepositSvg from '../../assets/icons/wallet/deposit.svg';

interface IDepositIcon {
    fill?: string;
}

const Deposit: React.FunctionComponent<IDepositIcon> = ({
    fill = '#40434F',
}) => <DepositSvg fill={fill} />;

export default Deposit;
