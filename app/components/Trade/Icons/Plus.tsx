import * as React from 'react';

import PlusSvg from '../../assets/icons/buttons/plus.svg';

interface IProps {
    fill: string;
}

const Plus: React.FunctionComponent<IProps> = ({ fill }) => (
    <PlusSvg fill={fill} />
);

export default Plus;
