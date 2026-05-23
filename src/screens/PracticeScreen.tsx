import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export default function PracticeScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.hero}>Practice</Text>
      <Text style={typography.subtitle}>Ear training and quizzes</Text>
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
