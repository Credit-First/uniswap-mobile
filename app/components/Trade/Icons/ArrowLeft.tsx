import * as React from 'react';

import ArrowLeftSvg from '../../assets/icons/buttons/arrowLeft.svg';

interface IArrowLeftIcon {
    fill?: string;
    size?: 20 | 16 | 12;
}

const ArrowLeft: React.FunctionComponent<IArrowLeftIcon> = ({
    fill = '#40434F',
    size = 20,
}) =>
    React.useMemo(
        () => <ArrowLeftSvg height={size} width={size} fill={fill} />,
        [size, fill]
    );

export default ArrowLeft;
