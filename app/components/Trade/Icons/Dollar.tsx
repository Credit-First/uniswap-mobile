import * as React from 'react';

import DollarSvg from '../../assets/icons/general/dollar.svg';

interface IProps {
    size?: 20 | 16 | 25 | number;
}

const Dollar: React.FunctionComponent<IProps> = ({ size = 20 }) =>
    React.useMemo(() => <DollarSvg height={size} width={size} />, [size]);

export default Dollar;
