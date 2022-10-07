import * as React from 'react';

import { iconsData } from './iconsData';

const CryptoExchanges = ({ slug }) => {
  const Icon = React.useMemo(() => {
    return iconsData[slug].icon;
  }, [slug]);

  return Icon;
};

export default CryptoExchanges;
