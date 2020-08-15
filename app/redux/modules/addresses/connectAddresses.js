import { connect } from 'react-redux';
import { addressesActionCreators } from './actions';

function mapStateToProps({ addressesState }) {
  return {
    addressesState,
  };
}

const mapDispatchToProps = addressesActionCreators;

export function connectAddresses(configMapStateToProps = mapStateToProps) {
  return connect(
    configMapStateToProps,
    mapDispatchToProps,
  );
}
