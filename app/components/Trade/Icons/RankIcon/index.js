import * as React from 'react';

import CommonIcon from '../../../../assets/icons/ranks/common.svg';
import DiamondIcon from '../../../../assets/icons/ranks/diamond.svg';
import EpicIcon from '../../../../assets/icons/ranks/epic.svg';
import ExoticIcon from '../../../../assets/icons/ranks/exotic.svg';
import FreeIcon from '../../../../assets/icons/ranks/free.svg';
import LegendaryIcon from '../../../../assets/icons/ranks/legendary.svg';
import MysticalIcon from '../../../../assets/icons/ranks/mystical.svg';
import RareIcon from '../../../../assets/icons/ranks/rare.svg';
import RoyalIcon from '../../../../assets/icons/ranks/royal.svg';
import UncommonIcon from '../../../../assets/icons/ranks/uncommon.svg';
import UnusualIcon from '../../../../assets/icons/ranks/unusual.svg';

const RankIcon = ({ slug, size = 72 }) => {
  return React.useMemo(() => {
    switch (slug) {
      case 'free':
        return <FreeIcon width={size} height={size} />;
      case 'common':
        return <CommonIcon width={size} height={size} />;
      case 'uncommon':
        return <UncommonIcon width={size} height={size} />;
      case 'unusual':
        return <UnusualIcon width={size} height={size} />;
      case 'rare':
        return <RareIcon width={size} height={size} />;
      case 'mystical':
        return <MysticalIcon width={size} height={size} />;
      case 'legendary':
        return <LegendaryIcon width={size} height={size} />;
      case 'epic':
        return <EpicIcon width={size} height={size} />;
      case 'exotic':
        return <ExoticIcon width={size} height={size} />;
      case 'royal':
        return <RoyalIcon width={size} height={size} />;
      case 'diamond':
        return <DiamondIcon width={size} height={size} />;
      default:
        return <></>;
    }
  }, [slug, size]);
};

export default RankIcon;
