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
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
  },
  button: {
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default styles;
