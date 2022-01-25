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
  qrcode: {
    alignSelf: 'center',
    marginBottom: 5,
  },
  list: {
    marginTop: 5,
  },
  listItem: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  link: {
    color: 'blue',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
  buttonIcon: {
    width: 48,
    height: 48,
  },
  hidden: {
    opacity: 0,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 5,
  },
  balanceItem: {
    flex: 1,
  },
  spacer: {
    marginTop: 10,
  },
});

export default styles;
