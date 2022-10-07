import React from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import TokenList from '../TokenList';
const TokenListModal = ({
  closeModal,
  type,
  tokenList,
  handleSelectToken,

  // tokenPair
}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Token</Text>
              <Text onPress={closeModal} style={styles.close}>
                X
              </Text>
            </View>
            <View style={styles.body}>
              <TokenList
                tokenList={tokenList}
                handleSelectToken={handleSelectToken}
                type={type}
              />
            </View>
            {/* <View style={styles.footer} /> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    height: '50%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  header: {
    width: '100%',
    height: 50,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    width: '100%',
    height: 150,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
  close: { marginRight: 5, marginTop: 5, fontSize: 20 },
});

export default TokenListModal;
