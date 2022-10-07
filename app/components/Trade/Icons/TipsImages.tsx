import * as React from 'react';
import { Image } from 'react-native';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

interface IProps {
    type: 'default' | 'blur' | 'glare' | 'cut';
}
export const TipsImages = ({ type }: IProps) => {
    const colorScheme = useColorScheme();
    const iguanaBlur = require('../../assets/icons/mint/tipsImageBlur.png');
    const iguanaGlare = require('../../assets/icons/mint/tipsImageGlare.png');
    const iguanaCut = require('../../assets/icons/mint/tipsImageCut.png');
    const iguanaDefault = require('../../assets/icons/mint/tipsImageDefault.png');
    const Icon = React.useMemo(() => {
        let icon = null;
        switch (type) {
            case 'blur':
                icon = (
                    <Image
                        source={iguanaBlur}
                        height={62}
                        width={53}
                        resizeMode="contain"
                        style={{ height: 62, width: 62 }}
                    />
                );
                break;
            case 'glare':
                icon = (
                    <Image
                        source={iguanaGlare}
                        resizeMode="contain"
                        style={{ height: 62, width: 62 }}
                    />
                );
                break;
            case 'cut':
                icon = (
                    <Image
                        source={iguanaCut}
                        height={62}
                        width={53}
                        resizeMode="contain"
                        style={{
                            height: 62,
                            width: 53,
                            backgroundColor:
                                Colors[colorScheme].surface.tertiary,
                        }}
                    />
                );
                break;
            default:
                icon = (
                    <Image
                        source={iguanaDefault}
                        height={62}
                        width={53}
                        style={{ height: 62, width: 53 }}
                    />
                );
                break;
        }
        return icon;
    }, [type]);
    return Icon;
};
