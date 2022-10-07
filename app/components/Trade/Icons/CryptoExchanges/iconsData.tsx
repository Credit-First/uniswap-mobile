import { ReactElement } from 'react';
import { SvgProps } from 'react-native-svg';

import BinanceIcon from '../../../assets/icons/coins/Binance.svg';

interface IIconsData {
    icon: ReactElement<SvgProps>;
}

export type IconsData = {
    Binance: IIconsData;
};

export const iconsData: IconsData = {
    Binance: {
        icon: <BinanceIcon width={32} height={32} />,
    },
};
