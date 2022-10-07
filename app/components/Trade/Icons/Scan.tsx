import * as React from 'react';
import { ViewStyle } from 'react-native';

import ScanSvg from '../../assets/icons/buttons/scan.svg';

interface IScanIcon {
    style?: ViewStyle;
}

const Scan: React.FunctionComponent<IScanIcon> = ({ style }) => (
    <ScanSvg style={style} />
);

export default Scan;
