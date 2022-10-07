import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useContext } from 'react';
import { StyleProp, TouchableOpacity, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserContext } from '../../contexts/UserContext';
import { WalletContext } from '../../contexts/Wallet/WalletContext';
import { verticalScale } from '../../helpers/dimensions';
import useThemedStyles from '../../hooks/useThemedStyles';
import { useNavigation } from '../../navigation/helpers';
import Avatar from '../Avatar';
import Button from '../Button';
import { ICON_NAMES } from '../Icons';
import { View } from '../Themed';
import UserRole from '../UserRole';
import NavigationAdmin, { NavigationAdminType } from './NavigationAdmin';
import NavigationBarTitle from './NavigationBarTitle';
import NavigationTasks, { NavigationTasksType } from './NavigationTasks';
import NavigationWallet, { NavigationWalletType } from './NavigationWallet';
import Wallet from './Wallet';
import stylesMain from './styles';

export type NavigationWidgetType = 'WALLET' | 'TASKS' | 'ADMIN' | undefined;

interface IProps {
    backIcon?: 'close' | 'leftArrow';
    onBack?: () => void;
    filled?: boolean;
    wallet?: boolean;
    settingsIcon?: boolean | ICON_NAMES;
    navigationWidget?: NavigationWidgetType;
    currentNavigation?:
        | NavigationWalletType
        | NavigationTasksType
        | NavigationAdminType;
    title?: string;
    children?: React.ReactNode;
    containerStyle?: StyleProp<ViewProps>;
    account?: boolean;
    onPressSettings?: () => void;
}

const NavigationBar = ({
    backIcon = undefined,
    onBack = undefined,
    filled = true,
    wallet = false,
    account = false,
    settingsIcon = false,
    navigationWidget = undefined,
    currentNavigation = undefined,
    title,
    children,
    containerStyle,
    onPressSettings,
}: IProps) => {
    const styles = useThemedStyles(stylesMain);
    const { user } = useContext(UserContext);
    const { walletBalance } = useContext(WalletContext);
    const navigation = useNavigation();
    const { top } = useSafeAreaInsets();

    const handleOnBack = () => (onBack ? onBack() : navigation.goBack());

    const handleOnAccount = () => {
        navigation.navigateToProfile();
    };

    const renderBackButton = () => {
        return (
            <View style={styles.buttonWrapper}>
                <Button
                    size="md"
                    type="outline"
                    iconName={
                        backIcon === 'close'
                            ? ICON_NAMES.CLOSE
                            : ICON_NAMES.ARROW_LEFT
                    }
                    style={styles.singleButton}
                    onPress={handleOnBack}
                />
            </View>
        );
    };

    const renderBackButtonWithChildren = () => {
        return (
            <>
                <View style={styles.buttonWrapperChildren}>
                    <Button
                        size="md"
                        type="outline"
                        iconName={
                            backIcon === 'close'
                                ? ICON_NAMES.CLOSE
                                : ICON_NAMES.ARROW_LEFT
                        }
                        style={styles.singleButton}
                        onPress={handleOnBack}
                    />
                </View>
                {children}
            </>
        );
    };

    const renderAccountIcon = () => {
        return (
            <TouchableOpacity
                onPress={handleOnAccount}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Avatar size={styles.avatar.width} type="white" />
                <View style={styles.roleWrapper}>
                    <UserRole size={styles.role.width} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderSettingsIcon = () => {
        return (
            <View style={styles.buttonWrapper}>
                <Button
                    size="md"
                    type="outline"
                    iconName={
                        typeof settingsIcon === 'boolean'
                            ? ICON_NAMES.SETTINGS
                            : settingsIcon
                    }
                    style={styles.singleButton}
                    onPress={
                        onPressSettings
                            ? onPressSettings
                            : () => console.log('Navigation settings')
                    }
                />
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                navigationWidget && styles.spaceBetween,
                filled && styles.containerFilled,
                children && styles.withChildren,
                containerStyle,
                { paddingTop: verticalScale(top + 16) },
            ]}>
            {/* Back button on the left without children */}
            {!!backIcon && !children && renderBackButton()}
            {/* Profile */}
            {account && renderAccountIcon()}
            {/* Wallet */}
            {wallet && <Wallet user={user} walletBalance={walletBalance} />}
            {/* Wallet Navigation */}
            {navigationWidget === 'WALLET' && (
                <NavigationWallet
                    currentNavigation={
                        currentNavigation as NavigationWalletType
                    }
                />
            )}
            {/* Tasks Navigation */}
            {navigationWidget === 'TASKS' && (
                <NavigationTasks
                    currentNavigation={currentNavigation as NavigationTasksType}
                />
            )}
            {/* Admin Navigation */}
            {navigationWidget === 'ADMIN' && (
                <NavigationAdmin
                    currentNavigation={currentNavigation as NavigationAdminType}
                />
            )}
            {/* Back button with children */}
            {!!children && renderBackButtonWithChildren()}
            {/* Navigation title */}
            {title && <NavigationBarTitle title={title} />}
            {/* Settings icon */}
            {!!settingsIcon && renderSettingsIcon()}
            {/* Hack to add empty view which take place on the right */}
            {((title && !settingsIcon) ||
                (!!navigationWidget && !settingsIcon)) && (
                <View style={styles.emptyIcon}></View>
            )}
        </View>
    );
};

export default NavigationBar;
