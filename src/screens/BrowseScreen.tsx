import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export default function BrowseScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.hero}>Modes</Text>
      <Text style={typography.subtitle}>Browse all 7 diatonic modes</Text>
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
