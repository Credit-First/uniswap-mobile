import useColorScheme from './useColorScheme';

const useThemedStyles = styles => {
  const colorScheme = useColorScheme();
  return styles(colorScheme);
};

export default useThemedStyles;
