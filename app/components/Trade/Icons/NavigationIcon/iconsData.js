import Admin from '../../../../../assets/icons/tabbar/AdminIcon.svg';
import AdminActive from '../../../../../assets/icons/tabbar/AdminIconActive.svg';
import Collection from '../../../../../assets/icons/tabbar/CollectionIcon.svg';
import CollectionActive from '../../../../../assets/icons/tabbar/CollectionIconActive.svg';
import Heart from '../../../../../assets/icons/tabbar/DonationsIcon.svg';
import HeartActive from '../../../../../assets/icons/tabbar/DonationsIconActive.svg';
import Marketplace from '../../../../../assets/icons/tabbar/MarketplaceIcon.svg';
import MarketplaceActive from '../../../../../assets/icons/tabbar/MarketplaceIconActive.svg';
import Play from '../../../../../assets/icons/tabbar/PlayIcon.svg';
import PlayActive from '../../../../../assets/icons/tabbar/PlayIconActive.svg';
import Statistics from '../../../../../assets/icons/tabbar/StatisticsIcon.svg';
import StatisticsActive from '../../../../../assets/icons/tabbar/StatisticsIconActive.svg';

export const iconsData = {
  Play: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Play width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <PlayActive width={25} height={25} />,
  },
  Charity: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Heart width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <HeartActive width={25} height={25} />,
  },
  Statistics: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Statistics width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <StatisticsActive width={25} height={25} />,
  },
  Collection: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Collection width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <CollectionActive width={25} height={25} />,
  },
  Marketplace: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Marketplace width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <MarketplaceActive width={25} height={25} />,
  },
  Admin: {
    // eslint-disable-next-line react/react-in-jsx-scope
    icon: <Admin width={25} height={25} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconActive: <AdminActive width={25} height={25} />,
  },
};
