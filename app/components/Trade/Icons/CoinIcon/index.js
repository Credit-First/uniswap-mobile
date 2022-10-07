import * as React from 'react';

import { iconsData } from './iconsData';

const CoinIcon = ({ slug, size }) => {
  const Icon = React.useMemo(() => {
    return size === 32 ? iconsData[slug].iconBig : iconsData[slug].iconSmall;
  }, [slug, size]);

  return Icon;
};

export default CoinIcon;
