import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: width - 40,
    alignSelf: 'center',
  },
  buttonIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFF',
  },
});

export default styles;
