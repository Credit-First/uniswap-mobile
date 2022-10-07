import * as React from 'react';

import { iconsData } from './iconsData';

const NavigationIcon = ({ name, active }) => {
  const Icon = React.useMemo(() => {
    return active ? iconsData[name].iconActive : iconsData[name].icon;
  }, [name, active]);

  return Icon;
};

export default NavigationIcon;
