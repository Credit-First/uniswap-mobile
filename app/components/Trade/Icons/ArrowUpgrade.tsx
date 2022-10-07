import * as React from 'react';

import ArrowUpgradeSvg from '../../assets/icons/buttons/arrowUpgrade.svg';

interface IArrowLeftIcon {
    fill?: string;
    size?: 20 | 16 | 12;
}

const ArrowUpgrade: React.FunctionComponent<IArrowLeftIcon> = ({
    fill = '#40434F',
    size = 20,
}) =>
    React.useMemo(
        () => <ArrowUpgradeSvg height={size} width={size} fill={fill} />,
        [size, fill]
    );

export default ArrowUpgrade;
