import { ReactElement } from 'react';
import { SvgProps } from 'react-native-svg';

import FeedGameTaskIcon from '../../../assets/icons/play/feedGameTask.svg';
import ShareInSocialGameTaskIcon from '../../../assets/icons/play/shareInSocialGameTask.svg';
import WalkGameTaskIcon from '../../../assets/icons/play/walkGameTask.svg';

export type IconsData = {
    SHARE: ReactElement<SvgProps>;
    WALK: ReactElement<SvgProps>;
    FEED: ReactElement<SvgProps>;
};

export const iconsData: IconsData = {
    SHARE: <ShareInSocialGameTaskIcon />,
    WALK: <WalkGameTaskIcon />,
    FEED: <FeedGameTaskIcon />,
};
