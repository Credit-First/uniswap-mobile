import { StyleSheet } from 'react-native';

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
    padding: 5,
  },
  header: {
    marginTop: 5,
  },
  list: {
    marginTop: 5,
  },
  error: {
    padding: 10,
    color: '#BF0F0F',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
  hidden: {
    opacity: 0,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 5,
  },
  balanceItem: {
    flex: 1,
  },
  spacer: {
    marginTop: 5,
  },
  qrcode: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 14,
  }
});

export default styles;
