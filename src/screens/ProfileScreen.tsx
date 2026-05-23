import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={typography.hero}>Profile</Text>
      <Text style={typography.subtitle}>Your progress</Text>
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
