import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import useThemedStyles from '../../hooks/useThemedStyles';
import Divider from '../Divider';
import { Text, View } from '../Themed';
import stylesMain from './styles';

declare type KeyValueType =
    | {
          key: string;
          value: any;
          divider?: boolean;
      }
    | undefined;

interface IProps {
    values: KeyValueType[];
    containerStyle?: StyleProp<ViewStyle>;
}

const TransactionSummary = ({ values, containerStyle }: IProps) => {
    const styles = useThemedStyles(stylesMain);

    return (
        <View style={containerStyle}>
            {values.map((item, index) => {
                if (item) {
                    return (
                        <View key={index}>
                            <View
                                style={[
                                    styles.textWrapper,
                                    index + 1 !== values.length
                                        ? styles.gap
                                        : {},
                                ]}>
                                <Text style={styles.keyText}>
                                    {item.key + ': '}
                                </Text>
                                {typeof item.value === 'string' ? (
                                    <Text style={styles.valueText}>
                                        {item.value}
                                    </Text>
                                ) : (
                                    <View style={styles.valueComponent}>
                                        {item.value}
                                    </View>
                                )}
                            </View>
                            {item.divider && (
                                <Divider customStyles={styles.gap} />
                            )}
                        </View>
                    );
                }
            })}
        </View>
    );
};
export default TransactionSummary;
