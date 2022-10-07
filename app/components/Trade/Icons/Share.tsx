import * as React from 'react';

import ShareSvg from '../../assets/icons/buttons/share.svg';

interface IProps {
    size?: number;
    fill?: '';
}

const Share: React.FunctionComponent<IProps> = ({ size = 20, fill = '' }) =>
    React.useMemo(
        () => <ShareSvg height={size} width={size} color={fill} />,
        [size]
    );

export default Share;
