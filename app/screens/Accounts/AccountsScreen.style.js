import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import {
  PRIMARY_BLUE,
} from '../../theme/colors';

const styles = StyleSheet.create({
  scrollContentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#FFF',
    flexDirection: 'column',
    width: '100%'
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  accountContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  networkContainer: {
    justifyContent: 'flex-end',
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
    marginBottom: 1,
    marginHorizontal: 20,
  },
  logo: {
    display: 'flex',
    alignSelf: 'center',
    height: 135,
    width: 135,
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 16,
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
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 6,
    elevation: 4,
    backgroundColor: '#F1F6FF',
    padding: 5,
    marginTop: 10,
  },
  contentContainer: {
    marginLeft: 10,
  },
  tokenName: {
    fontSize: 15,
    color: PRIMARY_BLUE,
  },
});

export default styles;
