import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, FlatList, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KInput } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const ListFIORequestsScreen = props => {
  const {
    navigation: { navigate, goBack },
    route: {
      params: { fioAccount, fioRequests, title },
    },
    // accountsState: { accounts, addresses, keys, config },
  } = props;

  const [filter, setFilter] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(fioRequests);

  //console.log(fioRequests[0]);

  const onChangeFilter = text => {
    setFilter(text);
    if(text.length > 0) {
      let result = fioRequests.filter(
        (item, index) => (item.payee_fio_address.indexOf(text) >= 0),
      );
      setFilteredRequests(result);
    } else { // else - no filtering:
      setFilteredRequests(fioRequests);
    }
  }

  const _handleViewFIORequest = fioRequest => {
    navigate('ViewFIORequest', { fioAccount, fioRequest, title });
  };

  const getRequestTitle = item => {
    return item.payer_fio_address + ' -> ' + item.payee_fio_address;
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
        <KHeader
          title={title}
          subTitle={fioAccount.address}
          style={styles.header}
        />
        <KInput
          label={'Filter requests'}
          value={filter}
          onChangeText={onChangeFilter}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <FlatList
          data={filteredRequests}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <KButton
              title={getRequestTitle(item)}
              style={styles.button}
              onPress={() => _handleViewFIORequest(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(ListFIORequestsScreen);
