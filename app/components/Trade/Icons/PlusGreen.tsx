import * as React from 'react';

import PlusGreenSvg from '../../assets/icons/buttons/plusGreen.svg';

interface IProps {
    size: 20 | 16;
}

const PlusGreen: React.FunctionComponent<IProps> = ({ size }) => (
    <PlusGreenSvg height={size} width={size} />
);

export default PlusGreen;
