import { connect } from 'react-redux';
import { tokensActionCreators } from './actions';

function mapStateToProps({ tokensState }) {
  return {
    tokensState,
  };
}

const mapDispatchToProps = tokensActionCreators;

export function connectTokens(configMapStateToProps = mapStateToProps) {
  return connect(
    configMapStateToProps,
    mapDispatchToProps,
  );
}
