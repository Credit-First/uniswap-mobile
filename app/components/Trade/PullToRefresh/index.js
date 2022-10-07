import * as React from 'react';
import {
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import { wait } from '../../../helpers/helpers';
import useThemedStyles from '../../../hooks/useThemedStyles';
import PullToRefreshArrow from './components/PullToRefreshArrow';
import PullToRefreshHeader from './components/PullToRefreshHeader';
import Styles from './styles';

const textDefaultPulling = 'pullText';
const textDefaultReleasing = 'releaseText';
const textDefaultLoading = 'loadingText';

const isAndroid = true;

const config = {
  timeout: 30000, // time will work when the bad or slow request
  refreshingHeight: 100, // Refreshing height in px
  headerPaddingTop: 70, // The paddingTop of the header element with animation
  minAnimationDuration: 1000, // Minimum amount of time when animation will be running. If promise resolved in 300s, it will still run at least 1000
  slidingAnimationDuration: 500, // Animation sliding back duration time
};

const PullToRefresh = ({
  renderItem,
  onRefresh,
  refreshing,
  textLoading = textDefaultLoading,
  textPulling = textDefaultPulling,
  textReleasing = textDefaultReleasing,
}) => {
  const styles = useThemedStyles(Styles);

  const [offsetY, setOffsetY] = React.useState(0);
  const [startTimestamp, setStartTimestamp] = React.useState(0);
  const [refresh, setRefresh] = React.useState(true); // for the second reload
  const [extraPaddingTop] = React.useState(new Animated.Value(0));
  const timerRef = React.useRef(null);
  // special states which helps to make animation more smooth and run at least minAnimationDuration
  const [animationRefreshing, setAnimationRefreshing] = React.useState(false);

  // end of animation refreshing
  const endAnimatedRefreshing = () => {
    Animated.timing(extraPaddingTop, {
      toValue: 0,
      duration: config.slidingAnimationDuration,
      useNativeDriver: false,
    }).start();
    setAnimationRefreshing(false);
    setRefresh(false);
  };

  React.useEffect(() => {
    let isMounted = true;

    if (refreshing && refresh) {
      setAnimationRefreshing(true);

      Animated.timing(extraPaddingTop, {
        toValue: config.headerPaddingTop,
        duration: 0,
        useNativeDriver: false,
      }).start();

      timerRef.current = setTimeout(() => {
        isMounted && endAnimatedRefreshing();
      }, config.timeout);

      isMounted && setStartTimestamp(Date.now());
    } else {
      let endTimestamp = Date.now();
      let difference = endTimestamp - startTimestamp;

      wait(
        difference < config.minAnimationDuration
          ? config.minAnimationDuration - difference
          : 0,
      ).then(() => {
        clearTimeout(timerRef.current);
        isMounted && endAnimatedRefreshing();
      });
    }

    return () => {
      isMounted = false;
    };
  }, [refreshing, refresh]);

  function onScroll(event) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);
  }

  function onRelease() {
    setRefresh(true);
    if (offsetY <= -config.refreshingHeight && (!refreshing || !refresh)) {
      onRefresh();
      console.log('Pull To Refresh released. Running onRefresh()');
    }
  }

  // resets animation for Android
  const onRefreshReset = () => {
    setRefresh(!refresh);
    onRefresh();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={
          isAndroid ? (
            <RefreshControl onRefresh={onRefreshReset} refreshing={false} />
          ) : (
            <></>
          )
        }
        onScroll={onScroll}
        onResponderRelease={onRelease}
        data={['']}
        style={styles.flatlist}
        ListEmptyComponent={null}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <PullToRefreshHeader
              textLoading={textLoading}
              isRefreshing={animationRefreshing}>
              <PullToRefreshArrow
                offsetY={offsetY}
                refreshingHeight={config.refreshingHeight}
                textLoading={textLoading}
                textReleasing={textReleasing}
                textPulling={textPulling}
                isRefreshing={animationRefreshing}
              />
            </PullToRefreshHeader>
            <Animated.View style={{ height: extraPaddingTop }} />
          </>
        }
      />
    </SafeAreaView>
  );
};

export default PullToRefresh;
