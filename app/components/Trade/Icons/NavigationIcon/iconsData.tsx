import { ReactElement } from 'react';
import { SvgProps } from 'react-native-svg';

import Admin from '../../../assets/icons/tabbar/AdminIcon.svg';
import AdminActive from '../../../assets/icons/tabbar/AdminIconActive.svg';
import Collection from '../../../assets/icons/tabbar/CollectionIcon.svg';
import CollectionActive from '../../../assets/icons/tabbar/CollectionIconActive.svg';
import Heart from '../../../assets/icons/tabbar/DonationsIcon.svg';
import HeartActive from '../../../assets/icons/tabbar/DonationsIconActive.svg';
import Marketplace from '../../../assets/icons/tabbar/MarketplaceIcon.svg';
import MarketplaceActive from '../../../assets/icons/tabbar/MarketplaceIconActive.svg';
import Play from '../../../assets/icons/tabbar/PlayIcon.svg';
import PlayActive from '../../../assets/icons/tabbar/PlayIconActive.svg';
import Statistics from '../../../assets/icons/tabbar/StatisticsIcon.svg';
import StatisticsActive from '../../../assets/icons/tabbar/StatisticsIconActive.svg';

interface IIconsData {
    icon: ReactElement<SvgProps>;
    iconActive: ReactElement<SvgProps>;
}

export type IconsData = {
    Play: IIconsData;
    Charity: IIconsData;
    Statistics: IIconsData;
    Collection: IIconsData;
    Marketplace: IIconsData;
    Admin: IIconsData;
};

export const iconsData: IconsData = {
    Play: {
        icon: <Play width={25} height={25} />,
        iconActive: <PlayActive width={25} height={25} />,
    },
    Charity: {
        icon: <Heart width={25} height={25} />,
        iconActive: <HeartActive width={25} height={25} />,
    },
    Statistics: {
        icon: <Statistics width={25} height={25} />,
        iconActive: <StatisticsActive width={25} height={25} />,
    },
    Collection: {
        icon: <Collection width={25} height={25} />,
        iconActive: <CollectionActive width={25} height={25} />,
    },
    Marketplace: {
        icon: <Marketplace width={25} height={25} />,
        iconActive: <MarketplaceActive width={25} height={25} />,
    },
    Admin: {
        icon: <Admin width={25} height={25} />,
        iconActive: <AdminActive width={25} height={25} />,
    },
};
