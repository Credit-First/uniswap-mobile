import React, { useRef } from 'react';
import Modal from 'react-native-modal/dist/modal';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import i18n from '../../i18n/i18n';
import Button, { ButtonType } from '../Button';
import LoadingComponent from '../LoadingComponent';
import { View } from '../Themed';
import stylesMain from './styles';

interface IProps {
    text?: string | undefined;
    visibility: boolean;
    modalCloseAction?: () => void;
    timeout?: number;
}

const config = {
    timeout: 25000,
};

const ModalLoading = ({
    text = undefined,
    visibility,
    modalCloseAction,
    timeout = config.timeout,
}: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const colorScheme = useColorScheme();

    const [loadingTimeout, setLoadingTimeout] = React.useState<boolean>(false);
    const [cancelClicked, setCancelClicked] = React.useState<boolean>(false);
    const timerRef = useRef<any>(null);

    // Add cancel bottom which appears when modal is loading longer than timeout
    React.useEffect(() => {
        let isMounted = true;

        if (visibility) {
            console.log('Start loading');

            timerRef.current = setTimeout(() => {
                console.log('timeout');
                isMounted && setLoadingTimeout(true);
            }, timeout);

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }

        return () => {
            isMounted = false;
        };
    }, [visibility]);

    const cancelLoader = () => {
        setCancelClicked(true);
    };

    return (
        <Modal
            style={styles.modal}
            isVisible={visibility && !cancelClicked}
            backdropColor={Colors[colorScheme].modal.modalOverlay}
            backdropOpacity={0}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            onModalHide={modalCloseAction}
            useNativeDriverForBackdrop={true}>
            <View style={styles.shadow}>
                <View style={styles.container}>
                    <LoadingComponent
                        text={text}
                        imageStyles={styles.iconWrapper}
                    />
                    {loadingTimeout && (
                        <View>
                            <Button
                                onPress={cancelLoader}
                                title={i18n.t('general.cancel')}
                                type="text"
                                size="md"
                                textStyles={styles.buttonLeave}
                                style={styles.buttonGap}
                                containerStyle={styles.buttonContainer}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
export default ModalLoading;
