import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export default function LearnScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.hero}>Learn</Text>
      <Text style={typography.subtitle}>Progressive lessons on modal jazz</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
});
