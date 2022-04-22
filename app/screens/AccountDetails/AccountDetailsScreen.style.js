import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
  },
  alert: {
    color: 'red',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  request_send_button: {
    marginTop: 5,
  },
  buttonIcon: {
    width: 48,
    height: 48,
  },
  inputContainer: {
    marginTop: 8,
  },
  spacer: {
    marginTop: 10,
  },
  autoSpacer: {
    flex: 1,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 14,
  },
});

export default styles;
