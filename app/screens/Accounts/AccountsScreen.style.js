import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  listItem: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  spacer: {
    marginTop: 20,
  },
});

export default styles;
