import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutChart = ({ data, totalExpenses }) => {
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;

  const necessaryPercentage = totalExpenses > 0 ? (data[0].amount / totalExpenses) * 100 : 0;
  
  const necessaryStrokeDashoffset =
    circleCircumference - (circleCircumference * necessaryPercentage) / 100;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true, // true is supported for some SVG props in newer RN versions, but safer false for strokeDashoffset often. Let's try true first as direct manipulation might work with wrappers, or false if it fails. Actually, let's use false for maximum compatibility with SVG props unless using Reanimated.
      useNativeDriver: false, 
    }).start();
  }, [necessaryPercentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, necessaryStrokeDashoffset],
  });

  return (
    <View>
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
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#2E8B57"
            fill="transparent"
            strokeWidth="40"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default DonutChart;