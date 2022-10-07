import * as React from 'react';

import HeartSvg from '../../assets/icons/general/heart.svg';

interface IProps {
    size?: 20 | 16 | 25 | number;
}

const Heart: React.FunctionComponent<IProps> = ({ size = 20 }) =>
    React.useMemo(() => <HeartSvg height={size} width={size} />, [size]);

export default Heart;
