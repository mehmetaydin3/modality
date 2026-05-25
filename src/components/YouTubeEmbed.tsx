import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = (SCREEN_WIDTH - 48) * 9 / 16;

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  artist?: string;
}

export default function YouTubeEmbed({ videoId, title, artist }: YouTubeEmbedProps) {
  const [error, setError] = useState(false);

  const openInYouTube = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  if (error) {
    return (
      <TouchableOpacity style={styles.fallback} onPress={openInYouTube} activeOpacity={0.8}>
        <Ionicons name="logo-youtube" size={24} color="#FF0000" />
        <View style={styles.fallbackText}>
          <Text style={styles.fallbackTitle}>{title || 'Watch on YouTube'}</Text>
          {artist && <Text style={styles.fallbackArtist}>{artist}</Text>}
          <Text style={styles.fallbackHint}>Tap to open in YouTube</Text>
        </View>
        <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  }

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
        <script>
          // Detect player errors via YouTube iframe API
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(tag);
          function onYouTubeIframeAPIReady() {
            new YT.Player('player', {
              events: {
                onError: function(e) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', code: e.data }));
                }
              }
            });
          }
        </script>
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
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === 'error') setError(true);
          } catch {}
        }}
        onHttpError={() => setError(true)}
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
  fallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: 8,
  },
  fallbackText: { flex: 1 },
  fallbackTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  fallbackArtist: { fontSize: 12, color: colors.accent, marginTop: 2 },
  fallbackHint: { fontSize: 11, color: colors.textTertiary, marginTop: 4 },
});
