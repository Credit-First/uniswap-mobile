import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Image,
  View,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KButton, KHeader } from '../../components';
import styles from './Settings.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger'


const SettingsScreen = props => {
  const {
    setConfig,
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, config },
  } = props;

  const [simpleUXSwitch, setSimpleUXSwitch] = useState(config.simpleUX);
  const [usePinCodeSwitch, setUsePinCodeSwitch] = useState(config.usePinCode);
  const [showAllTokensSwitch, setShowAllTokensSwitch] = useState(config.showAllTokens);

  const setSimpleUX = (val) => {
    setSimpleUXSwitch(val);
    config.simpleUX = val;
    setConfig(config);
    GLOBAL.config = config;
  };

  const setUsePinCode = (val) => {
    setUsePinCodeSwitch(val);
    config.usePinCode = val;
    setConfig(config);
    GLOBAL.config = config;
  };

  const setShowAllTokens = (val) => {
    setShowAllTokensSwitch(val);
    config.showAllTokens = val;
    setConfig(config);
    GLOBAL.config = config;
  };

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.inner}>
     <TouchableOpacity style={styles.backButton} onPress={goBack}>
       <MaterialIcon
         name={'keyboard-backspace'}
         size={24}
         color={PRIMARY_BLUE}
       />
     </TouchableOpacity>
     <KHeader title={'Settings'} style={styles.header} />
     <Text>Simple UX:</Text>
     <Switch onValueChange={setSimpleUX} value={simpleUXSwitch}/>
     <Text>Require PIN Code for entry:</Text>
     <Switch onValueChange={setUsePinCode} value={usePinCodeSwitch}/>
     <Text>Show zero balance tokens:</Text>
     <Switch onValueChange={setShowAllTokens} value={showAllTokensSwitch}/>
    </View>
  </SafeAreaView>
  );

};


export default connectAccounts()(SettingsScreen);
