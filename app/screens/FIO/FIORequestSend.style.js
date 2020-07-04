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
    padding: 20,
  },
  header: {
    marginTop: 10,
  },
  list: {
    marginTop: 10,
  },
  button: {
    marginTop: 8,
  },
  hidden: {
    opacity: 0,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 10,
  },
  balanceItem: {
    flex: 1,
  },
  spacer: {
    marginTop: 10,
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
