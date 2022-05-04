import { StyleSheet, Dimensions } from 'react-native';
import { PRIMARY_BLUE } from '../../theme/colors';
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
  },
  buttonIcon: {
    width: 72,
    height: 72,
  },
  inputContainer: {
    marginTop: 10,
  },
  spacer: {
    flex: 1,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 14,
  },
  balanceView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginTop: 10,
  },
  blueLabel: {
    fontSize: 16,
    color: PRIMARY_BLUE,
  }
});

export default styles;
