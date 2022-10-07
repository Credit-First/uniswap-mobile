import * as React from 'react';

import { IconsData, iconsData } from './iconsData';

interface IProps {
    slug: string;
}

const GameTaskIcon = ({ slug }: IProps) => {
    const Icon = React.useMemo(() => {
        return iconsData[slug as keyof IconsData];
    }, [slug]);
    return Icon;
};

export default GameTaskIcon;
