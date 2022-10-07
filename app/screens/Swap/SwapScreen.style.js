import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContentContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {
    marginTop: 5,
  },
  list: {
    marginTop: 0,
  },
  linearGradient: {
    flex: 0.5,
    borderRadius: 10, // <-- Outer Border Radius
  },
  swapContainer: {
    backgroundColor: '#f8f9ec',
    flex: 1,
    flexDirection: 'column',
    width: '95%',
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  swapHeader: {
    flex: 0.1,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  swapBody: {
    flex: 0.6,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
  },

  tokenInOut: {
    backgroundColor: 'white',
    flex: 0.5,
    borderRadius: 15,
    justifyContent: 'center',
  },
  swapFooter: {
    flex: 0.3,
    display: 'flex',
    justifyContent: 'center',
  },
  walletSelect: {
    marginBottom: 20,
  },
});

export default styles;
