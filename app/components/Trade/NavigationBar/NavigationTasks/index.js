import * as React from 'react';

import useThemedStyles from '../../../hooks/useThemedStyles';
import i18n from '../../../i18n/i18n';
import { useNavigation } from '../../../navigation/helpers';
import ROUTES from '../../../navigation/routes';
import { View } from '../../Themed';
import NavigationItem from '../NavigationItem';
import stylesMain from './styles';

const NavigationTasks = ({ currentNavigation }) => {
  const styles = useThemedStyles(stylesMain);

  const navigation = useNavigation();

  const handleOnActivePress = () => {
    if (currentNavigation === 'ACTIVE') {
      return;
    }
    navigation.navigate(ROUTES.PLAY_TASKS_ACTIVE);
  };

  const handleOnHistoryPress = () => {
    if (currentNavigation === 'HISTORY') {
      return;
    }
    navigation.navigate(ROUTES.PLAY_TASKS_HISTORY);
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        <NavigationItem
          onPress={handleOnActivePress}
          title={i18n.t('navigationBar.tasks.active')}
          isActive={currentNavigation === 'ACTIVE'}
        />
        <NavigationItem
          onPress={handleOnHistoryPress}
          title={i18n.t('navigationBar.tasks.history')}
          isActive={currentNavigation === 'HISTORY'}
        />
      </View>
    </View>
  );
};
export default NavigationTasks;
