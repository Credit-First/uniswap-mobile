import * as React from 'react';

import { IconsData, iconsData } from './iconsData';

interface IProps {
    slug: string;
}

const StatusIcon = ({ slug }: IProps) => {
    const Icon = React.useMemo(() => {
        return iconsData[slug as keyof IconsData].icon;
    }, [slug]);

    return Icon;
};

export default StatusIcon;
