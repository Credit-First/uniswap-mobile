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
  qrcode: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  link: {
    color: 'blue',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
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
