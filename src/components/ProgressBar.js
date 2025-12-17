
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress.toFixed(2)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: '#A9A9A9',
    borderRadius: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#2E8B57',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#2E8B57',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ProgressBar;
