import * as React from 'react';
import ignoreWarnings from 'ignore-warnings';
import AnimatedLottieView from 'lottie-react-native';
import { AppState, AppStateStatus, StyleProp, ViewStyle } from 'react-native';
import { LogBox } from 'react-native';

ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]']);

LogBox.ignoreLogs([
  `ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.`,
]);

const ImageSequences = ({ source, style = {}, isPlaying }) => {
  const appState = React.useRef(AppState.currentState);
  const ref = React.createRef();

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    !isPlaying ? ref.current?.pause() : ref.current?.play();
  }, [isPlaying]);

  React.useEffect(() => {
    ref.current?.play();
  }, [source, ref.current]);

  const handleAppStateChange = nextAppState => {
    if (
      (appState.current === 'background' || appState.current === 'inactive') &&
      nextAppState === 'active'
    ) {
      ref.current?.play();
    }
    appState.current = nextAppState;
  };

  return (
    <AnimatedLottieView
      speed={source.speed}
      source={source.asset}
      autoPlay={true}
      loop={true}
      style={style}
      ref={ref}
    />
  );
};

export default ImageSequences;
