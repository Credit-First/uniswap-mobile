import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  rowContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    alignSelf: 'center',
    height: 200,
    width: 200,
  },
  inner: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginTop: 10,
  },
  top_header: {
    marginTop: 0,
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  link: {
    color: 'blue',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  error: {
    padding: 5,
    color: '#BF0F0F',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  validation: {
    padding: 2,
    color: '#BF0F0F',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
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
  captcha: {
    alignSelf: 'center',
    marginTop: 10,
    width: 200,
    height: 50,
  },
  buttonIcon: {
    width: 48,
    height: 48,
  },
});

export default styles;
