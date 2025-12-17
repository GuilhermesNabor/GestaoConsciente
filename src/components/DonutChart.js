import React from 'react';
import { View } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const DonutChart = ({ data, totalExpenses }) => {
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;

  const necessaryPercentage = (data[0].amount / totalExpenses) * 100;
  const unnecessaryPercentage = (data[1].amount / totalExpenses) * 100;

  const necessaryStrokeDashoffset =
    circleCircumference - (circleCircumference * necessaryPercentage) / 100;
  const unnecessaryStrokeDashoffset =
    circleCircumference - (circleCircumference * unnecessaryPercentage) / 100;

  return (
    <Animatable.View animation="fadeIn" duration={1500}>
      <Svg height="160" width="160" viewBox="0 0 180 180">
        <G rotation={-90} originX="90" originY="90">
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#A9A9A9"
            fill="transparent"
            strokeWidth="40"
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#2E8B57"
            fill="transparent"
            strokeWidth="40"
            strokeDasharray={circleCircumference}
            strokeDashoffset={necessaryStrokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </Animatable.View>
  );
};

export default DonutChart;