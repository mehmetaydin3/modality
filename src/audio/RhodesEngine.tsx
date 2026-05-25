import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export interface RhodesEngineRef {
  playNote: (midiNote: number, duration?: number) => void;
  playScale: (midiNotes: number[], onDegree?: (index: number) => void, onComplete?: () => void) => void;
  stop: () => void;
}

const RHODES_HTML = `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
<script>
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let activeNodes = [];
  let currentPlayId = 0;
  let pendingTimeouts = [];

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function playRhodesNote(freq, startTime, duration) {
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, startTime);

    const modGain = ctx.createGain();
    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 2, startTime);
    modGain.gain.setValueAtTime(freq * 0.8, startTime);
    modGain.gain.exponentialRampToValueAtTime(freq * 0.1, startTime + duration * 0.3);
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(gainNode);

    const tremolo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    tremolo.frequency.setValueAtTime(5, startTime);
    tremoloGain.gain.setValueAtTime(0.08, startTime);
    tremolo.connect(tremoloGain);
    tremoloGain.connect(gainNode.gain);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.6, startTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    modulator.start(startTime); modulator.stop(startTime + duration);
    carrier.start(startTime); carrier.stop(startTime + duration);
    tremolo.start(startTime); tremolo.stop(startTime + duration);
    activeNodes.push(gainNode, carrier, modulator, tremolo);
  }

  function stopAll() {
    // Cancel all pending timeouts
    pendingTimeouts.forEach(t => clearTimeout(t));
    pendingTimeouts = [];
    // Increment playId to invalidate any in-flight callbacks
    currentPlayId++;
    // Stop all audio nodes
    activeNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    activeNodes = [];
  }

  window.addEventListener('message', function(e) {
    const msg = JSON.parse(e.data);

    if (msg.type === 'stop') {
      stopAll();
      return;
    }

    if (msg.type === 'playNote') {
      if (ctx.state === 'suspended') ctx.resume();
      playRhodesNote(midiToFreq(msg.midi), ctx.currentTime, msg.duration || 0.8);
      return;
    }

    if (msg.type === 'playScale') {
      if (ctx.state === 'suspended') ctx.resume();
      stopAll(); // always stop previous before starting new
      const playId = currentPlayId;
      const notes = msg.notes;
      const noteDuration = 0.6;
      const noteGap = 0.65;

      notes.forEach((midi, i) => {
        playRhodesNote(midiToFreq(midi), ctx.currentTime + i * noteGap, noteDuration);
        const t = setTimeout(() => {
          if (currentPlayId === playId) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'degree', index: i, playId }));
          }
        }, i * noteGap * 1000);
        pendingTimeouts.push(t);
      });

      const t = setTimeout(() => {
        if (currentPlayId === playId) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'complete', playId }));
        }
      }, notes.length * noteGap * 1000);
      pendingTimeouts.push(t);
    }
  });

  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
</script>
</body>
</html>
`;

const RhodesEngine = forwardRef<RhodesEngineRef>((_, ref) => {
  const webViewRef = useRef<WebView>(null);
  const degreeCallbackRef = useRef<((index: number) => void) | null>(null);
  const completeCallbackRef = useRef<(() => void) | null>(null);
  const currentPlayIdRef = useRef(0);

  useImperativeHandle(ref, () => ({
    playNote: (midiNote: number, duration = 0.8) => {
      webViewRef.current?.injectJavaScript(
        `window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'playNote', midi: ${midiNote}, duration: ${duration} }) })); true;`
      );
    },
    playScale: (midiNotes: number[], onDegree?: (i: number) => void, onComplete?: () => void) => {
      currentPlayIdRef.current += 1;
      const playId = currentPlayIdRef.current;
      degreeCallbackRef.current = onDegree || null;
      completeCallbackRef.current = onComplete || null;
      webViewRef.current?.injectJavaScript(
        `window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'playScale', notes: ${JSON.stringify(midiNotes)} }) })); true;`
      );
    },
    stop: () => {
      currentPlayIdRef.current += 1; // invalidate callbacks
      degreeCallbackRef.current = null;
      completeCallbackRef.current = null;
      webViewRef.current?.injectJavaScript(
        `window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'stop' }) })); true;`
      );
    },
  }));

  return (
    <View style={styles.hidden}>
      <WebView
        ref={webViewRef}
        source={{ html: RHODES_HTML }}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === 'degree' && degreeCallbackRef.current) {
              degreeCallbackRef.current(msg.index);
            }
            if (msg.type === 'complete' && completeCallbackRef.current) {
              completeCallbackRef.current();
              degreeCallbackRef.current = null;
              completeCallbackRef.current = null;
            }
          } catch {}
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        style={styles.hidden}
      />
    </View>
  );
});

export default RhodesEngine;

const styles = StyleSheet.create({
  hidden: { width: 0, height: 0, opacity: 0 },
});
