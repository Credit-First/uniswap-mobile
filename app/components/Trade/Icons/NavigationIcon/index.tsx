import * as React from 'react';

import { IconsData, iconsData } from './iconsData';

interface IProps {
    name: string;
    active?: boolean | undefined;
}

const NavigationIcon = ({ name, active }: IProps) => {
    const Icon = React.useMemo(() => {
        return active
            ? iconsData[name as keyof IconsData].iconActive
            : iconsData[name as keyof IconsData].icon;
    }, [name, active]);

    return Icon;
};

export default NavigationIcon;
