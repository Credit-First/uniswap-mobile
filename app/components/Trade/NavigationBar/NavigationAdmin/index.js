import * as React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';

import { toastComingSoon } from '../../../helpers/toastNotification';
import useThemedStyles from '../../../hooks/useThemedStyles';
import i18n from '../../../i18n/i18n';
import ROUTES from '../../../navigation/routes';
import { View } from '../../Themed';
import NavigationItem from '../NavigationItem';
import stylesMain from './styles';

const NavigationTasks = ({ currentNavigation }) => {
  const styles = useThemedStyles(stylesMain);

  const navigation = useNavigation();

  const handleOnVerifyPress = () => {
    if (currentNavigation === 'VERIFY') {
      return;
    }
    navigation.dispatch(StackActions.replace(ROUTES.ADMIN_VERIFY));
  };

  const handleOnDashboardPress = () => {
    if (currentNavigation === 'DASHBOARD') {
      return;
    }

    toastComingSoon();
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        <NavigationItem
          onPress={handleOnVerifyPress}
          title={i18n.t('navigationBar.admin.verify')}
          isActive={currentNavigation === 'VERIFY'}
        />
        <NavigationItem
          onPress={handleOnDashboardPress}
          title={i18n.t('navigationBar.admin.dashboard')}
          isActive={currentNavigation === 'DASHBOARD'}
        />
      </View>
    </View>
  );
};
export default NavigationTasks;
