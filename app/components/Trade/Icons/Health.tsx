import * as React from 'react';

import HealthSvg from '../../assets/icons/general/health.svg';

interface IProps {
    size?: 20 | 16 | 25 | number;
}

const Health: React.FunctionComponent<IProps> = ({ size = 20 }) =>
    React.useMemo(() => <HealthSvg height={size} width={size} />, [size]);

export default Health;
