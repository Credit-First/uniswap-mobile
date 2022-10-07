import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const SettingModal = ({ isVisible, setSettingModalVisible }) => {
  const [value, onChangeText] = useState('');
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setSettingModalVisible(!isVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setSettingModalVisible(!isVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable> */}
            <View style={styles.header}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '400',
                  alignSelf: 'flex-end',
                  paddingBottom: 10,
                }}>
                Transaction Settings
              </Text>
              <Text
                onPress={() => setSettingModalVisible(false)}
                style={{ marginRight: 5, marginTop: 5 }}>
                X
              </Text>
            </View>
            <View style={styles.body}>
              <Text>Slippage tolerance ?</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Pressable
                  onPress={() => {
                    alert('ok');
                  }}
                  style={{
                    height: 30,
                    backgroundColor: '#2196f3',
                    borderRadius: 5,
                    elevation: 3,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                  }}>
                  <Text style={{ color: 'white' }}>Auto</Text>
                </Pressable>
                <TextInput
                  onChangeText={text => onChangeText(text)}
                  value={value}
                  style={{
                    padding: 5,
                    borderRadius: 5,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: '50%',
                    height: 30,
                    marginRight: 10,
                  }}
                />
              </View>

              <Text>Transaction deadline ?</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <TextInput
                  onChangeText={text => onChangeText(text)}
                  value={value}
                  style={{
                    borderRadius: 5,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: 100,
                    height: 30,
                    padding: 5,
                  }}
                />
                <Text style={{ fontSize: 15, marginLeft: 10 }}>minutes</Text>
              </View>
            </View>
            {/* <View style={styles.footer} /> */}
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setSettingModalVisible(isVisible)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
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
    padding: 10,
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
    height: 'auto',
  },
  header: {
    width: '100%',
    // backgroundColor: 'red',
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
    // backgroundColor: 'green',
    height: 150,
    // borderBottomWidth: 1,
    // borderBottomColor: '#d4d4d4',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  footer: { width: '100%', height: 50 },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
});

export default SettingModal;
