import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';

interface VideoPreloaderProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export default function VideoPreloader({ onComplete }: VideoPreloaderProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const webVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleDismiss = (immediate = false) => {
    if (isDismissed) return;
    setIsDismissed(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cfvd_preloader_seen', 'true');
        if ((window as any).__dismissCfvdPreloader) {
          (window as any).__dismissCfvdPreloader(immediate);
        }
      } catch (_e) {}
    }

    if (immediate) {
      if (onComplete) onComplete();
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      if (onComplete) onComplete();
    });
  };

  useEffect(() => {
    // Safety auto-dismiss fallback after 9.5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 9500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    if (Platform.OS === 'web' && webVideoRef.current) {
      const nextMuted = !webVideoRef.current.muted;
      webVideoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const handleTimeUpdate = (e: any) => {
    const video = e.target;
    if (video && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      setProgress(Math.min(100, pct));
    }
  };

  if (isDismissed) {
    return null;
  }

  // Native WebView implementation for iOS / Android
  const nativeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #020612; overflow: hidden; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          video { width: 100%; height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <video id="v" autoplay ${isMuted ? 'muted' : ''} playsinline preload="auto">
          <source src="http://localhost:8081/preloader.mp4" type="video/mp4" />
          <source src="http://localhost:5000/uploads/preloader.mp4" type="video/mp4" />
        </video>
        <script>
          var v = document.getElementById('v');
          v.addEventListener('ended', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ENDED' }));
          });
          v.addEventListener('timeupdate', function() {
            if (v.duration) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PROGRESS', pct: (v.currentTime / v.duration) * 100 }));
            }
          });
          v.play().catch(function() {
            v.muted = true;
            v.play();
          });
        </script>
      </body>
    </html>
  `;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#020612" translucent />

      {/* Main Video Presentation */}
      <View style={styles.videoWrapper}>
        {Platform.OS === 'web' ? (
          <video
            ref={webVideoRef}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#020612'
            }}
            src="/preloader.mp4"
            onEnded={() => handleDismiss()}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: nativeHtml }}
            style={styles.webView}
            scrollEnabled={false}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'ENDED') {
                  handleDismiss();
                } else if (data.type === 'PROGRESS') {
                  setProgress(Math.min(100, data.pct || 0));
                }
              } catch (_e) {}
            }}
          />
        )}
      </View>

      {/* Floating Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandBadge}>
          <Text style={{ fontSize: 14 }}>🏏</Text>
          <Text style={styles.brandText}>CRICKET FEDERATION</Text>
        </View>

        <View style={styles.actionRow}>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={styles.soundBtn} onPress={toggleSound} activeOpacity={0.8}>
              <Text style={{ fontSize: 13 }}>{isMuted ? '🔇' : '🔊'}</Text>
              <Text style={styles.soundBtnText}>{isMuted ? 'UNMUTE' : 'MUTE'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.skipBtn} onPress={() => handleDismiss()} activeOpacity={0.85}>
            <Text style={styles.skipBtnText}>SKIP INTRO</Text>
            <Text style={styles.skipBtnClose}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Title & Synchronized Golden Progress Line */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomSubtitle}>
          VIRUDHUNAGAR DISTRICT CRICKET ASSOCIATION • OFFICIAL PORTAL
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#020612',
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#020612',
    justifyContent: 'center',
    alignItems: 'center'
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#020612'
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(2, 6, 18, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999
  },
  brandText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#f59e0b',
    textTransform: 'uppercase'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 9999
  },
  soundBtnText: {
    color: '#f8fafc',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f59e0b',
    borderWidth: 1,
    borderColor: '#fbbf24',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 9999,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  skipBtnText: {
    color: '#020612',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  skipBtnClose: {
    color: '#020612',
    fontSize: 13,
    fontWeight: '900'
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 18,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10
  },
  bottomSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center'
  },
  progressTrack: {
    width: '100%',
    maxWidth: 480,
    height: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 3
  }
});
