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
  alert: {
    color: 'red',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  header: {
    marginTop: 20,
  },
  list: {
    marginTop: 20,
  },
  button: {
    marginTop: 8,
  },
  balanceContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  balanceItem: {
    flex: 1,
  },
  spacer: {
    marginTop: 10,
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: 'black'
  },
  center: {
    display: 'flex',
    alignItems: 'center'
  },
  nftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default styles;
