import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import CrossIcon from '../../assets/icons/cross123.svg';

import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ButtonCancelBottom = ({ extraStyle, Icon, handlePress }) => {
  const { bottom } = useSafeAreaInsets();
  const { resetCart } = useActionCreator();
  return (
    <Pressable
      onPress={() => (handlePress || resetCart)()}
      style={[styles.main, extraStyle, {}]}>
      {!Icon && <CrossIcon height={36} width={36} />}
      {Icon && <Icon height={36} width={36} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF6464',
  },
});

export default ButtonCancelBottom;
