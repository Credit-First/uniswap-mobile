import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContentContainer: {
    // flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  inner: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginTop: 10,
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFF',
  },
  inputContainer: {
    marginTop: 10,
  },
  spacer: {
    marginTop: 10,
  },
});

export default styles;
