import * as React from 'react';

import ExploreIcon from '../../assets/icons/buttons/explore.svg';

interface IProps {
    size?: 24 | 20 | 16 | number;
}

const Explore: React.FunctionComponent<IProps> = ({ size = 24 }) =>
    React.useMemo(() => <ExploreIcon height={size} width={size} />, [size]);

export default Explore;
