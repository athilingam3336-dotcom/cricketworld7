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
  const [showHint, setShowHint] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
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

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.14,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.95,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 580,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  };

  useEffect(() => {
    // Safety auto-dismiss fallback after 9.5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 9500);

    // Try unmuted audio on web immediately, register gesture listeners if blocked
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const activateSound = () => {
        if (webVideoRef.current) {
          webVideoRef.current.muted = false;
          webVideoRef.current.volume = 1.0;
          if (webVideoRef.current.paused) {
            webVideoRef.current.play().catch(() => {});
          }
        }
        setShowHint(false);
      };

      const events = ['click', 'touchstart', 'pointerdown', 'keydown'];
      events.forEach((evt) => {
        window.addEventListener(evt, activateSound, { capture: true, once: true });
      });

      if (webVideoRef.current) {
        webVideoRef.current.muted = false;
        webVideoRef.current.volume = 1.0;
        const playPromise = webVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (webVideoRef.current) {
              webVideoRef.current.muted = true;
              webVideoRef.current.play().catch(() => {});
              setShowHint(true);
            }
          });
        }
      }

      return () => {
        clearTimeout(timer);
        events.forEach((evt) => {
          window.removeEventListener(evt, activateSound, true);
        });
      };
    }

    return () => clearTimeout(timer);
  }, []);

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

  // Native WebView implementation for iOS / Android (unmuted stadium sound, edge-to-edge cover)
  const nativeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #020612; overflow: hidden; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          video { width: 100vw; height: 100vh; object-fit: cover; object-position: center center; }
        </style>
      </head>
      <body>
        <video id="v" autoplay playsinline webkit-playsinline preload="auto">
          <source src="http://localhost:8081/preloader.mp4" type="video/mp4" />
          <source src="http://localhost:5000/uploads/preloader.mp4" type="video/mp4" />
        </video>
        <script>
          var v = document.getElementById('v');
          v.muted = false;
          v.volume = 1.0;
          v.addEventListener('ended', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ENDED' }));
          });
          v.addEventListener('timeupdate', function() {
            if (v.duration) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PROGRESS', pct: (v.currentTime / v.duration) * 100 }));
            }
          });
          var playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch(function() {
              v.muted = true;
              v.play();
              window.addEventListener('touchstart', function() {
                v.muted = false;
                v.volume = 1.0;
              }, { once: true });
            });
          }
        </script>
      </body>
    </html>
  `;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#020612" translucent />

      {/* Main Video Presentation (Edge-to-Edge Full Screen Coverage) */}
      <View style={styles.videoWrapper}>
        {Platform.OS === 'web' ? (
          <video
            ref={webVideoRef}
            autoPlay
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              backgroundColor: '#020612',
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
      <View style={styles.topBar} pointerEvents="box-none">
        <View style={styles.brandBadge}>
          <Text style={{ fontSize: 13 }}>🏏</Text>
          <Text style={styles.brandText}>CRICKET FEDERATION</Text>
        </View>

        <View style={styles.actionRow} pointerEvents="box-none">
          {/* Always-on Unmuted Stadium Sound Badge */}
          <View style={styles.soundBadge}>
            <Text style={{ fontSize: 12 }}>🔊</Text>
            <Text style={styles.soundBadgeText}>SOUND ON</Text>
          </View>

          {/* Skip Button (Instant Touch & Click Responsive) */}
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => handleDismiss()}
            // @ts-ignore
            onClick={() => handleDismiss()}
            // @ts-ignore
            onTouchEnd={() => handleDismiss()}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>SKIP INTRO</Text>
            <Text style={styles.skipBtnClose}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sound Interaction Hint */}
      {showHint && (
        <View style={styles.soundHintBadge}>
          <Text style={styles.soundHintText}>🔊 TAP ANYWHERE FOR FULL STADIUM SOUND</Text>
        </View>
      )}

      {/* Bottom Title & Synchronized Golden Progress Line */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomSubtitle}>
          VIRUDHUNAGAR DISTRICT CRICKET ASSOCIATION • OFFICIAL PORTAL
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Stadium Flash Overlay during dismiss transition */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            opacity: flashAnim,
          },
        ]}
      />
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
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999999,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(2, 6, 18, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999
  },
  brandText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#f59e0b',
    textTransform: 'uppercase'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  soundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999
  },
  soundBadgeText: {
    color: '#fbbf24',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  soundHintBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 9999,
    zIndex: 999999
  },
  soundHintText: {
    color: '#fef08a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.7)',
    zIndex: 9999999
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f59e0b',
    borderWidth: 1.5,
    borderColor: '#fbbf24',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 9999,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999999,
  },
  skipBtnText: {
    color: '#020612',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  skipBtnClose: {
    color: '#020612',
    fontSize: 12,
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

