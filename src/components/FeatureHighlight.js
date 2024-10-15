/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Colors,
  Typography,
  Button,
  FeatureHighlight,
} from 'react-native-ui-lib';
import _ from 'lodash';

const FeatureHighlighter = ({
  showFTE,
  setShowFTE,
  titles,
  messages,
  targets,
}) => {
  const [currentTargetIndex, setCurrentTargetIndex] = React.useState(0);
  const lastPage = titles.length - 1;

  const moveToPage = React.useCallback(
    index => {
      if (index < _.size(targets)) {
        setCurrentTargetIndex(index);
      } else {
        setShowFTE(false);
      }
    },
    [targets, setShowFTE],
  );

  const moveNext = () => {
    moveToPage(currentTargetIndex + 1);
  };

  const movePrev = () => {
    if (currentTargetIndex === 0) {
      setShowFTE(false);
    }
    moveToPage(currentTargetIndex - 1);
  };

  const onPagePress = index => {
    moveToPage(index);
  };

  console.log(currentTargetIndex);

  const getPageControlProps = () => {
    return {
      numOfPages: titles.length,
      currentPage: currentTargetIndex,
      onPagePress: onPagePress,
      color: Colors.grey30,
      inactiveColor: Colors.grey80,
      size: 8,
    };
  };

  return (
    <FeatureHighlight
      visible={showFTE}
      title={titles[currentTargetIndex]}
      message={messages[currentTargetIndex]}
      titleStyle={
        currentTargetIndex === lastPage ? { ...Typography.text70 } : undefined
      }
      messageStyle={
        currentTargetIndex === lastPage
          ? { ...Typography.text60, fontWeight: '900', lineHeight: 28 }
          : undefined
      }
      confirmButtonProps={{ label: 'Next', onPress: moveNext }}
      prevButtonProps={{
        label: currentTargetIndex === 0 ? 'Skip' : 'Previous',
        onPress: movePrev,
      }}
      // onBackgroundPress={this.closeHighlight}
      getTarget={() => targets[currentTargetIndex]}
      // highlightFrame={{x: 30, y: 70, width: 150, height: 30}}
      // highlightFrame={{x: 160, y: 336, width: 150, height: 56}}
      borderRadius={14}
      pageControlProps={
        currentTargetIndex < lastPage ? getPageControlProps() : undefined
      }
      currentTargetIndex={currentTargetIndex}
    />
  );
};

export default FeatureHighlighter;

const styles = StyleSheet.create({});
