import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { PRIMARY_BLUE } from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: width - 40,
    alignSelf: 'center',
  },
  buttonIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFF',
  },
  inputContainer: {
    marginTop: 20,
  },
  chainLabel: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    marginTop: 40,
  },
  chainItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chainItem: {
    alignItems: 'center',
    width: 80,
    borderColor: 'gray',
  },
  chainItemSelected: {
    borderBottomWidth: 4,
  },
  chainItemImage: {
    width: 40,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default styles;
