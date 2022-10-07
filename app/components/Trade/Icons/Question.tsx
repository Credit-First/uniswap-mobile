import * as React from 'react';

import QuestionSvg from '../../assets/icons/buttons/questionTransparent.svg';

interface IProps {
    size?: 20 | 16 | 25 | number;
    fill?: '';
}

const Question: React.FunctionComponent<IProps> = ({ size = 20, fill = '' }) =>
    React.useMemo(
        () => <QuestionSvg height={size} width={size} color={fill} />,
        [size]
    );

export default Question;
