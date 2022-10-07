import { ReactElement } from 'react';
import { SvgProps } from 'react-native-svg';

import BNBCoinSmall from '../../../assets/icons/coins/bnbCoin.svg';
import BNBCoinBig from '../../../assets/icons/coins/bnbCoinBig.svg';
import IGUCoinSmall from '../../../assets/icons/coins/iguCoin.svg';
import IGUCoinBig from '../../../assets/icons/coins/iguCoinBig.svg';
import IGUPCoinSmall from '../../../assets/icons/coins/igupCoin.svg';
import IGUPCoinBig from '../../../assets/icons/coins/igupCoinBig.svg';

interface IIconsData {
    iconBig: ReactElement<SvgProps>;
    iconSmall: ReactElement<SvgProps>;
}

export type IconsData = {
    BNB: IIconsData;
    IGU: IIconsData;
    IGUP: IIconsData;
};

export const iconsData: IconsData = {
    BNB: {
        iconBig: <BNBCoinBig width={32} height={32} />,
        iconSmall: <BNBCoinSmall width={20} height={20} />,
    },
    IGU: {
        iconBig: <IGUCoinBig width={32} height={32} />,
        iconSmall: <IGUCoinSmall width={20} height={20} />,
    },
    IGUP: {
        iconBig: <IGUPCoinBig width={32} height={32} />,
        iconSmall: <IGUPCoinSmall width={20} height={20} />,
    },
};
