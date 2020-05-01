import React from 'react';
import { View, SafeAreaView, Image } from 'react-native';

import styles from './ConnectAccountScreen.style';
import { KHeader, KButton } from '../../components';

const ConnectAccountScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <KHeader title={'Account'} subTitle={'Connect your account'} />
      <KButton
        title={'Connect account'}
        theme={'blue'}
        style={styles.button}
        renderIcon={() => (
          <Image
            source={require('../../../assets/icons/accounts.png')}
            style={styles.buttonIcon}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ConnectAccountScreen;
