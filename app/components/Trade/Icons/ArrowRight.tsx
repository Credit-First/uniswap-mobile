import * as React from 'react';

import ArrowRightSvg from '../../assets/icons/buttons/arrowRight.svg';

interface IArrowRightIcon {
    fill?: string;
    size?: 20 | 16 | 12;
}

const ArrowRight: React.FunctionComponent<IArrowRightIcon> = ({
    fill = '#40434F',
    size = 12,
}) =>
    React.useMemo(
        () => <ArrowRightSvg height={size} width={size} fill={fill} />,
        [size, fill]
    );

export default ArrowRight;
