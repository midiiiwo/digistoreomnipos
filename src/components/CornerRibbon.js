import React from 'react';
import Svg, { Polygon, G, Text as Text_ } from 'react-native-svg';

function CornerRibbon(props) {
  const { status } = props;
  const color_ =
    status === 'Paid' || status === 'Successful'
      ? 'rgba(33, 156, 144, 0.1)'
      : 'rgba(199, 0, 57, 0.1)';
  const textColor =
    status === 'Paid' || status === 'Successful'
      ? 'rgba(33, 156, 144, 1)'
      : 'rgba(199, 0, 57, 1)';
  return (
    <Svg height="75" width="75">
      <Polygon points="0 0, 70 70, 70 40, 30 0" fill={color_} strokeWidth="0" />
      <G rotation="45" origin="130, -20">
        <Text_
          x="100"
          y="81"
          stroke={textColor}
          fill={textColor}
          fontSize={15}
          textAnchor="middle">
          {status}
        </Text_>
      </G>
    </Svg>
  );
}

export default CornerRibbon;
