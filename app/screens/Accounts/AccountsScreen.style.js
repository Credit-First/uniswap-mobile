import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFF',
  },
});

export default styles;
