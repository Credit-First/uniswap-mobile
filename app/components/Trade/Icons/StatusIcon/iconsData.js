import { ReactElement } from 'react';
import { SvgProps } from 'react-native-svg';

import ConfirmedIcon from '../../../../assets/icons/statuses/completed.svg';
import FailedIcon from '../../../../assets/icons/statuses/failed.svg';
import PendingIcon from '../../../../assets/icons/statuses/pending.svg';

export const iconsData = {
  CONFIRMED: {
    icon: <ConfirmedIcon width={20} height={20} />,
  },
  PENDING: {
    icon: <PendingIcon width={20} height={20} />,
  },
  FAILED: {
    icon: <FailedIcon width={20} height={20} />,
  },
};
