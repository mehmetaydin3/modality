import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = (SCREEN_WIDTH - 48) * 9 / 16;

interface YouTubeEmbedProps {
  videoId: string;
}

export default function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={PLAYER_HEIGHT}
        videoId={videoId}
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
        }}
        initialPlayerParams={{
          rel: false,
          modestbranding: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
});
