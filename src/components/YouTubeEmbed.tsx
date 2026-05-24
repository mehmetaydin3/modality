import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, radius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = (SCREEN_WIDTH - 48) * 9 / 16;

export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; background: #000; }
          iframe { width: 100%; height: 100vh; border: none; }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 48,
    height: PLAYER_HEIGHT,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});
