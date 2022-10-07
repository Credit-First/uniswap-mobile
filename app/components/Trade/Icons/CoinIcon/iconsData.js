import BNBCoinSmall from '../../../../../assets/icons/coins/bnbCoin.svg';
import BNBCoinBig from '../../../../../assets/icons/coins/bnbCoinBig.svg';
import IGUCoinSmall from '../../../../../assets/icons/coins/iguCoin.svg';
import IGUCoinBig from '../../../../../assets/icons/coins/iguCoinBig.svg';
import IGUPCoinSmall from '../../../../../assets/icons/coins/igupCoin.svg';
import IGUPCoinBig from '../../../../../assets/icons/coins/igupCoinBig.svg';

export const iconsData = {
  BNB: {
    // eslint-disable-next-line react/react-in-jsx-scope
    iconBig: <BNBCoinBig width={32} height={32} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconSmall: <BNBCoinSmall width={20} height={20} />,
  },
  IGU: {
    // eslint-disable-next-line react/react-in-jsx-scope
    iconBig: <IGUCoinBig width={32} height={32} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconSmall: <IGUCoinSmall width={20} height={20} />,
  },
  IGUP: {
    // eslint-disable-next-line react/react-in-jsx-scope
    iconBig: <IGUPCoinBig width={32} height={32} />,
    // eslint-disable-next-line react/react-in-jsx-scope
    iconSmall: <IGUPCoinSmall width={20} height={20} />,
  },
};
