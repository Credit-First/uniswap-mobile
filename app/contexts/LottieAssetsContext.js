import * as FileSystem from 'expo-file-system';
import { Asset, useAssets } from 'expo-asset';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createContext } from 'react';

export const LottieAssetsContext = createContext({
  isLoaded: false,
  welcomeAsset: undefined,
  loadingAsset: undefined,
  dancingAsset: undefined,
  runningAsset: undefined,
});

export const useLottieAssets = () => React.useContext(LottieAssetsContext);

const LottieAssetsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { lottie: welcomeAsset } = useLottieAsset(
    require('../assets/animations/welcome.dat'),
    0.3,
  );
  const { lottie: loadingAsset } = useLottieAsset(
    require('../assets/animations/loading.dat'),
    0.3,
  );
  const { lottie: dancingAsset } = useLottieAsset(
    require('../assets/animations/dancing.dat'),
    0.25,
  );
  const { lottie: runningAsset } = useLottieAsset(
    require('../assets/animations/running.dat'),
    0.9,
  );

  useEffect(() => {
    if (
      loadingAsset &&
      welcomeAsset &&
      dancingAsset &&
      runningAsset &&
      !isLoaded
    ) {
      setIsLoaded(true);
    }
  }, [loadingAsset, welcomeAsset, dancingAsset, runningAsset]);

  return (
    <LottieAssetsContext.Provider
      value={{
        isLoaded,
        welcomeAsset,
        loadingAsset,
        dancingAsset,
        runningAsset,
      }}>
      {children}
    </LottieAssetsContext.Provider>
  );
};

const useLottieAsset = (path, speed) => {
  const [asset] = useAssets([path]);
  const [lottie, setLottie] = useState(undefined);

  useEffect(() => {
    if (lottie) {
      return;
    }
    async function loadAsset(assets) {
      if (assets) {
        const json = await FileSystem.readAsStringAsync(
          assets[0].localUri ?? '',
        );
        const parsedJson = JSON.parse(json);
        return parsedJson;
      }
      return null;
    }
    loadAsset(asset).then(json => {
      if (json) {
        setLottie({
          asset: json,
          speed: speed,
        });
      }
    });
  }, [asset]);
  return { lottie };
};

export default LottieAssetsProvider;
