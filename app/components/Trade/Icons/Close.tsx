import * as React from 'react';

import CloseSvg from '../../assets/icons/buttons/close.svg';

interface ICloseIcon {
    fill?: string;
    size?: 20 | 16 | 12;
}

const Close: React.FunctionComponent<ICloseIcon> = ({
    fill = '#818598',
    size = 20,
}) =>
    React.useMemo(
        () => <CloseSvg height={size} width={size} fill={fill} />,
        [size, fill]
    );

export default Close;
