import * as React from 'react';

import LevelSvg from '../../assets/icons/general/level.svg';

interface ILevelIcon {
    size?: 64 | 20;
}

const Level: React.FunctionComponent<ILevelIcon> = ({ size = 20 }) =>
    React.useMemo(() => <LevelSvg height={size} width={size} />, [size]);

export default Level;
