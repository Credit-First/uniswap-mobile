import React from 'react';

import AppleIcon from './Apple';
import ArrowLeftIcon from './ArrowLeft';
import ArrowRightIcon from './ArrowRight';
import ArrowUpgrade from './ArrowUpgrade';
import BinIcon from './Bin';
import BiSwap from './Biswap';
import CameraIcon from './Camera';
import CancelBlack from './CancelBlack';
import CloseIcon from './Close';
import CooldownIcon from './Cooldown';
import DepositIcon from './Deposit';
import DollarIcon from './Dollar';
import DownArrow from './DownArrow';
import Energy from './Energy';
import ExploreIcon from './Explore';
import FacebookIcon from './Facebook';
import FullSizeIcon from './FullSize';
import GoogleIcon from './Google';
import GreenTrade from './GreenTrade';
import HealthIcon from './Health';
import Heart from './Heart';
import InstagramIcon from './Instagram';
import LevelIcon from './Level';
import LockIcon from './Lock';
import MagnificatGlass from './MagnificatGlass';
import MinusIcon from './Minus';
import Pause from './Pause';
import PencilIcon from './Pencil';
import Play from './Play';
import PlusIcon from './Plus';
import PlusGreen from './PlusGreen';
import QuestionIcon from './Question';
import ScanIcon from './Scan';
import SettingsIcon from './Settings';
import ShareIcon from './Share';
import Stop from './Stop';
import TradeIcon from './Trade';
import TwitterIcon from './Twitter';
import WithdrawIcon from './Withdraw';
import ICON_NAMES from './iconNames';

const Icons = {
    [ICON_NAMES.SETTINGS]: SettingsIcon,
    [ICON_NAMES.GOOGLE]: GoogleIcon,
    [ICON_NAMES.APPLE]: AppleIcon,
    [ICON_NAMES.FACEBOOK]: FacebookIcon,
    [ICON_NAMES.INSTAGRAM]: InstagramIcon,
    [ICON_NAMES.CLOSE]: CloseIcon,
    [ICON_NAMES.ARROW_LEFT]: ArrowLeftIcon,
    [ICON_NAMES.ARROW_RIGHT]: ArrowRightIcon,
    [ICON_NAMES.DOWN_ARROW]: DownArrow,
    [ICON_NAMES.CAMERA]: CameraIcon,
    [ICON_NAMES.PLUS]: PlusIcon,
    [ICON_NAMES.MINUS]: MinusIcon,
    [ICON_NAMES.BIN]: BinIcon,
    [ICON_NAMES.TWITTER]: TwitterIcon,
    [ICON_NAMES.PENCIL]: PencilIcon,
    [ICON_NAMES.PLUS_GREEN]: PlusGreen,
    [ICON_NAMES.DEPOSIT]: DepositIcon,
    [ICON_NAMES.WITHDRAW]: WithdrawIcon,
    [ICON_NAMES.TRADE]: TradeIcon,
    [ICON_NAMES.SCAN]: ScanIcon,
    [ICON_NAMES.LOCK]: LockIcon,
    [ICON_NAMES.MAGNIFICAT_GLASS]: MagnificatGlass,
    [ICON_NAMES.ENERGY]: Energy,
    [ICON_NAMES.BISWAP]: BiSwap,
    [ICON_NAMES.STOP]: Stop,
    [ICON_NAMES.PAUSE]: Pause,
    [ICON_NAMES.PLAY]: Play,
    [ICON_NAMES.HEART]: Heart,
    [ICON_NAMES.GREEN_TRADE]: GreenTrade,
    [ICON_NAMES.CANCEL_BLACK]: CancelBlack,
    [ICON_NAMES.ARROW_UPGRADE]: ArrowUpgrade,
    [ICON_NAMES.ARROW_UPGRADE_GREEN]: ArrowUpgrade,
    [ICON_NAMES.FULL_SIZE]: FullSizeIcon,
    [ICON_NAMES.LEVEL]: LevelIcon,
    [ICON_NAMES.EXPLORE]: ExploreIcon,
    [ICON_NAMES.COOLDOWN]: CooldownIcon,
    [ICON_NAMES.QUESTION]: QuestionIcon,
    [ICON_NAMES.SHARE]: ShareIcon,
    [ICON_NAMES.HEALTH]: HealthIcon,
    [ICON_NAMES.DOLLAR]: DollarIcon,
};

export { ICON_NAMES };

interface IIcon {
    name: ICON_NAMES;
    [property: string]: any;
}

const Icon: React.FunctionComponent<IIcon> = ({ name, ...rest }) => {
    const CurrentIcon = Icons[name as keyof typeof Icons];
    const { fill, size, ...other } = rest;
    return <CurrentIcon fill={fill} size={size} {...other} />;
};

export default Icon;
