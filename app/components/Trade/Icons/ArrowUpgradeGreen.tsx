import * as React from 'react';
import { useTheme } from '@react-navigation/native';

import ArrowUpgradeSvg from '../../assets/icons/buttons/arrowUpgrade.svg';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

interface IArrowLeftIcon {
    size?: 20 | 16 | 12;
}

const ArrowUpgradeGreen: React.FunctionComponent<IArrowLeftIcon> = ({
    size = 20,
}) => {
    const theme = useColorScheme();

    return (
        <ArrowUpgradeSvg
            height={size}
            width={size}
            fill={Colors[theme].text.accent}
        />
    );
};

export default ArrowUpgradeGreen;
