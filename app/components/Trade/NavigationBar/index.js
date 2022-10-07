import * as React from 'react';

import { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
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
import NavigationAdmin from './NavigationAdmin';
import NavigationBarTitle from './NavigationBarTitle';
import NavigationTasks from './NavigationTasks';
import NavigationWallet from './NavigationWallet';
import Wallet from './Wallet';
import stylesMain from './styles';

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
}) => {
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
            backIcon === 'close' ? ICON_NAMES.CLOSE : ICON_NAMES.ARROW_LEFT
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
              backIcon === 'close' ? ICON_NAMES.CLOSE : ICON_NAMES.ARROW_LEFT
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
            // currentNavigation as NavigationWalletType
            currentNavigation
          }
        />
      )}
      {/* Tasks Navigation */}
      {navigationWidget === 'TASKS' && (
        <NavigationTasks currentNavigation={currentNavigation} />
      )}
      {/* Admin Navigation */}
      {navigationWidget === 'ADMIN' && (
        <NavigationAdmin currentNavigation={currentNavigation} />
      )}
      {/* Back button with children */}
      {!!children && renderBackButtonWithChildren()}
      {/* Navigation title */}
      {title && <NavigationBarTitle title={title} />}
      {/* Settings icon */}
      {!!settingsIcon && renderSettingsIcon()}
      {/* Hack to add empty view which take place on the right */}
      {((title && !settingsIcon) || (!!navigationWidget && !settingsIcon)) && (
        <View style={styles.emptyIcon} />
      )}
    </View>
  );
};

export default NavigationBar;
