import * as React from 'react';

import { IconsData, iconsData } from './iconsData';

const StatusIcon = ({ slug }) => {
  const Icon = React.useMemo(() => {
    return iconsData[slug].icon;
  }, [slug]);

  return Icon;
};

export default StatusIcon;
