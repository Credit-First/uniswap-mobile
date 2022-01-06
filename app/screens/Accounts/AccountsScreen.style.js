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
  iconComponentWrapper: {
    marginRight: 8,
  },
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginTop: 20,
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonIcon: {
    width: 48,
    height: 48,
  },
  qrcode: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  link: {
    color: 'blue',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  total: {
    color: 'blue',
    alignSelf: 'center',
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    marginBottom: 10,
  },
  version: {
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
  },
  listItem: {
    marginTop: 5,
    marginHorizontal: 20,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  spacer: {
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 10,
  },
  alert: {
    padding: 10,
    color: 'red',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  error: {
    color: '#FF0000',
    fontSize: 14,
  },
  chainIcon: {
    width: 18,
    height: 18,
  },
  chainName: {
    fontSize: 16,
    color: 'black',
  },
});

export default styles;
