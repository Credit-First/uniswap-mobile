import React from 'react';
import { View } from 'react-native';
import KSelect from '../../../components/KSelect';

const WalletList = ({ accounts, handleFromAccountChange, style }) => {
  return (
    <View>
      <KSelect
        label={'Wallets'}
        items={accounts}
        onValueChange={handleFromAccountChange}
        containerStyle={style}
      />
    </View>
  );
};

export default WalletList;
