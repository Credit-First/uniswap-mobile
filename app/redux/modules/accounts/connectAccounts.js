import { connect } from 'react-redux';
import { accountsActionCreators } from './actions';

function mapStateToProps({ accountsState }) {
  return {
    accountsState,
  };
}

const mapDispatchToProps = accountsActionCreators;

export function connectAccounts(configMapStateToProps = mapStateToProps) {
  return connect(
    configMapStateToProps,
    mapDispatchToProps,
  );
}
