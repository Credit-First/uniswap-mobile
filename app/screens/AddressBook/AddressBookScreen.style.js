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
    padding: 10,
  },
  header: {
    marginTop: 20,
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    marginBottom: 6,
  },
  buttonIcon: {
    width: 48,
    height: 48,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 14,
  },
  link: {
    color: 'blue',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  version: {
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
  },
  listItem: {
    marginTop: 10,
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
});

export default styles;
