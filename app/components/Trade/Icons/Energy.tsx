import * as React from 'react';

import EnergySvg from '../../assets/icons/general/energy.svg';

interface IProps {
    size?: 20 | 16 | 25 | number;
}

const Energy: React.FunctionComponent<IProps> = ({ size = 20 }) =>
    React.useMemo(() => <EnergySvg height={size} width={size} />, [size]);

export default Energy;
