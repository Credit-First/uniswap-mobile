import * as React from 'react';

import { IconsData, iconsData } from './iconsData';

interface IProps {
    slug: string;
    size: 20 | 32;
}

const CoinIcon = ({ slug, size }: IProps) => {
    const Icon = React.useMemo(() => {
        return size === 32
            ? iconsData[slug as keyof IconsData].iconBig
            : iconsData[slug as keyof IconsData].iconSmall;
    }, [slug, size]);

    return Icon;
};

export default CoinIcon;
