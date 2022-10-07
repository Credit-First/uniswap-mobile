import * as React from 'react';

import { iconsData } from './iconsData';

const GameTaskIcon = ({ slug }) => {
  const Icon = React.useMemo(() => {
    return iconsData[slug];
  }, [slug]);
  return Icon;
};

export default GameTaskIcon;
