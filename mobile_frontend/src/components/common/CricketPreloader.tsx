import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';

export interface CricketPreloaderProps {
  /** Controls visibility of the preloader */
  visible?: boolean;
  /** Render full-screen overlay (true) or embedded view (false) */
  fullscreen?: boolean;
  /** Optional completion callback triggered after the animation finishes */
  onComplete?: () => void;
  /** Whether the animation loops continuously or plays once (default: false - plays only once) */
  loop?: boolean;
}

export const CricketPreloader: React.FC<CricketPreloaderProps> = ({
  visible = true,
  fullscreen = true,
  onComplete,
  loop = false,
}) => {
  const useNative = Platform.OS !== 'web';

  // ─── ANIMATED VALUES ────────────────────────────────────────────────────────
  // Ball Delivery Trajectory
  const ballX = useRef(new Animated.Value(-90)).current;
  const ballY = useRef(new Animated.Value(-60)).current;
  const ballScale = useRef(new Animated.Value(0.65)).current;
  const ballOpacity = useRef(new Animated.Value(0)).current;
  const ballSpin = useRef(new Animated.Value(0)).current;

  // Pitch Bounce Puff
  const pitchPuffScale = useRef(new Animated.Value(0)).current;
  const pitchPuffOpacity = useRef(new Animated.Value(0)).current;

  // Impact Flash & LED Glow (Zing Stumps)
  const impactFlashScale = useRef(new Animated.Value(0)).current;
  const impactFlashOpacity = useRef(new Animated.Value(0)).current;
  const ledGlowOpacity = useRef(new Animated.Value(0)).current;
  const sparkAnim = useRef(new Animated.Value(0)).current;

  // Stumps Cartwheel & Shatter Transformations
  // Middle Stump (Direct hit, cartwheels backward)
  const middleStumpX = useRef(new Animated.Value(0)).current;
  const middleStumpY = useRef(new Animated.Value(0)).current;
  const middleStumpRot = useRef(new Animated.Value(0)).current;
  const middleStumpOpacity = useRef(new Animated.Value(1)).current;

  // Off Stump (Flies to the right)
  const offStumpX = useRef(new Animated.Value(0)).current;
  const offStumpY = useRef(new Animated.Value(0)).current;
  const offStumpRot = useRef(new Animated.Value(0)).current;
  const offStumpOpacity = useRef(new Animated.Value(1)).current;

  // Leg Stump (Tilts and knocks to the left)
  const legStumpX = useRef(new Animated.Value(0)).current;
  const legStumpY = useRef(new Animated.Value(0)).current;
  const legStumpRot = useRef(new Animated.Value(0)).current;
  const legStumpOpacity = useRef(new Animated.Value(1)).current;

  // Left Bail (Flies high up-left)
  const leftBailX = useRef(new Animated.Value(0)).current;
  const leftBailY = useRef(new Animated.Value(0)).current;
  const leftBailRot = useRef(new Animated.Value(0)).current;
  const leftBailOpacity = useRef(new Animated.Value(1)).current;

  // Right Bail (Flies high up-right)
  const rightBailX = useRef(new Animated.Value(0)).current;
  const rightBailY = useRef(new Animated.Value(0)).current;
  const rightBailRot = useRef(new Animated.Value(0)).current;
  const rightBailOpacity = useRef(new Animated.Value(1)).current;

  // Ground Shockwave Ring
  const shockwaveScale = useRef(new Animated.Value(0)).current;
  const shockwaveOpacity = useRef(new Animated.Value(0)).current;

  // Stumps Reset Fade
  const stumpsGroupOpacity = useRef(new Animated.Value(1)).current;

  // Ambient rotating ring around circle
  const ringSpin = useRef(new Animated.Value(0)).current;

  // ─── MASTER CLEAN BOWLED / STUMP CARTWHEEL CYCLE ───────────────────────────
  useEffect(() => {
    if (!visible) return;

    let isMounted = true;

    // Seam spin continuous loop
    const seamLoop = Animated.loop(
      Animated.timing(ballSpin, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );
    seamLoop.start();

    // Subtle outer circle ring rotation
    const ringLoop = Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );
    ringLoop.start();

    const runWicketShatterCycle = () => {
      if (!isMounted) return;

      // ── RESET ALL TO INITIAL STANCE ──
      ballX.setValue(-90);
      ballY.setValue(-60);
      ballScale.setValue(0.65);
      ballOpacity.setValue(0);

      middleStumpX.setValue(0);
      middleStumpY.setValue(0);
      middleStumpRot.setValue(0);
      middleStumpOpacity.setValue(1);

      offStumpX.setValue(0);
      offStumpY.setValue(0);
      offStumpRot.setValue(0);
      offStumpOpacity.setValue(1);

      legStumpX.setValue(0);
      legStumpY.setValue(0);
      legStumpRot.setValue(0);
      legStumpOpacity.setValue(1);

      leftBailX.setValue(0);
      leftBailY.setValue(0);
      leftBailRot.setValue(0);
      leftBailOpacity.setValue(1);

      rightBailX.setValue(0);
      rightBailY.setValue(0);
      rightBailRot.setValue(0);
      rightBailOpacity.setValue(1);

      impactFlashScale.setValue(0);
      impactFlashOpacity.setValue(0);
      ledGlowOpacity.setValue(0);
      sparkAnim.setValue(0);
      pitchPuffScale.setValue(0);
      pitchPuffOpacity.setValue(0);
      shockwaveScale.setValue(0);
      shockwaveOpacity.setValue(0);
      stumpsGroupOpacity.setValue(1);

      // ── STAGE 1: BALL INCOMING TOWARDS PITCH BOUNCE ──
      Animated.parallel([
        Animated.timing(ballOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: useNative,
        }),
        Animated.timing(ballX, {
          toValue: -32, // pitch bounce point inside circle
          duration: 380,
          easing: Easing.in(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.timing(ballY, {
          toValue: 16, // touches turf
          duration: 380,
          easing: Easing.in(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.timing(ballScale, {
          toValue: 0.85,
          duration: 380,
          useNativeDriver: useNative,
        }),
      ]).start(() => {
        if (!isMounted) return;

        // PITCH BOUNCE PUFF!
        pitchPuffScale.setValue(0.4);
        pitchPuffOpacity.setValue(1);
        Animated.parallel([
          Animated.timing(pitchPuffScale, {
            toValue: 1.8,
            duration: 200,
            useNativeDriver: useNative,
          }),
          Animated.timing(pitchPuffOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: useNative,
          }),
        ]).start();

        // ── STAGE 2: BALL SEAMS SHARPLY TOWARDS STUMPS ──
        Animated.parallel([
          Animated.timing(ballX, {
            toValue: 0, // contacts middle stump
            duration: 190,
            easing: Easing.linear,
            useNativeDriver: useNative,
          }),
          Animated.timing(ballY, {
            toValue: -8, // stump impact height
            duration: 190,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useNative,
          }),
          Animated.timing(ballScale, {
            toValue: 1,
            duration: 190,
            useNativeDriver: useNative,
          }),
        ]).start(() => {
          if (!isMounted) return;

          // ── STAGE 3: EXPLOSIVE COLLISION! STICKS & BAILS THERIKUTHU! ──
          impactFlashScale.setValue(0.5);
          impactFlashOpacity.setValue(1);
          ledGlowOpacity.setValue(1);
          sparkAnim.setValue(1);
          shockwaveScale.setValue(0.4);
          shockwaveOpacity.setValue(1);

          Animated.parallel([
            // Kinetic Shockwave & Flash
            Animated.timing(impactFlashScale, {
              toValue: 2.5,
              duration: 300,
              easing: Easing.out(Easing.ease),
              useNativeDriver: useNative,
            }),
            Animated.timing(impactFlashOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: useNative,
            }),
            Animated.timing(shockwaveScale, {
              toValue: 2.2,
              duration: 340,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(shockwaveOpacity, {
              toValue: 0,
              duration: 340,
              useNativeDriver: useNative,
            }),
            Animated.timing(sparkAnim, {
              toValue: 0,
              duration: 340,
              useNativeDriver: useNative,
            }),

            // Ball deflects after shattering stumps
            Animated.timing(ballX, {
              toValue: 28,
              duration: 320,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(ballY, {
              toValue: 14,
              duration: 320,
              easing: Easing.in(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.sequence([
              Animated.delay(180),
              Animated.timing(ballOpacity, {
                toValue: 0,
                duration: 140,
                useNativeDriver: useNative,
              }),
            ]),

            // 1. MIDDLE STUMP: Cartwheels backward!
            Animated.timing(middleStumpX, {
              toValue: 14,
              duration: 480,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(middleStumpY, {
              toValue: -58,
              duration: 480,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: useNative,
            }),
            Animated.timing(middleStumpRot, {
              toValue: 190,
              duration: 480,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),

            // 2. OFF STUMP: Flies to the right spinning
            Animated.timing(offStumpX, {
              toValue: 38,
              duration: 450,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(offStumpY, {
              toValue: -34,
              duration: 450,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: useNative,
            }),
            Animated.timing(offStumpRot, {
              toValue: 75,
              duration: 450,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),

            // 3. LEG STUMP: Uprooted, tilts left
            Animated.timing(legStumpX, {
              toValue: -22,
              duration: 420,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(legStumpY, {
              toValue: -16,
              duration: 420,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(legStumpRot, {
              toValue: -48,
              duration: 420,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),

            // 4. LEFT BAIL: Propels high up-left
            Animated.timing(leftBailX, {
              toValue: -38,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(leftBailY, {
              toValue: -65,
              duration: 500,
              easing: Easing.out(Easing.back(1.8)),
              useNativeDriver: useNative,
            }),
            Animated.timing(leftBailRot, {
              toValue: -360,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: useNative,
            }),

            // 5. RIGHT BAIL: Propels high up-right
            Animated.timing(rightBailX, {
              toValue: 42,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: useNative,
            }),
            Animated.timing(rightBailY, {
              toValue: -60,
              duration: 500,
              easing: Easing.out(Easing.back(1.8)),
              useNativeDriver: useNative,
            }),
            Animated.timing(rightBailRot, {
              toValue: 360,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: useNative,
            }),

            // LED glow fades
            Animated.sequence([
              Animated.delay(260),
              Animated.timing(ledGlowOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: useNative,
              }),
            ]),
          ]).start(() => {
            if (!isMounted) return;

            // IF LOOP IS FALSE: Play ONLY ONCE, trigger onComplete and stop!
            if (!loop) {
              if (onComplete) {
                setTimeout(onComplete, 250);
              }
              return;
            }

            // ── STAGE 4: SMOOTH SETTLE & DISSOLVE TO RE-STAND (LOOP MODE) ──
            Animated.timing(stumpsGroupOpacity, {
              toValue: 0,
              duration: 260,
              delay: 200,
              useNativeDriver: useNative,
            }).start(() => {
              if (isMounted) {
                setTimeout(runWicketShatterCycle, 150);
              }
            });
          });
        });
      });
    };

    runWicketShatterCycle();

    return () => {
      isMounted = false;
      seamLoop.stop();
      ringLoop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, useNative]);

  if (!visible) return null;

  // ─── INTERPOLATED VALUES ───────────────────────────────────────────────────
  const seamRotate = ballSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringRotate = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const midRotStr = middleStumpRot.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const offRotStr = offStumpRot.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const legRotStr = legStumpRot.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const leftBailRotStr = leftBailRot.interpolate({
    inputRange: [-720, 720],
    outputRange: ['-720deg', '720deg'],
  });

  const rightBailRotStr = rightBailRot.interpolate({
    inputRange: [-720, 720],
    outputRange: ['-720deg', '720deg'],
  });

  const sparkSpread = sparkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });

  const content = (
    <View style={[styles.rootContainer, fullscreen && styles.fullscreenContainer]}>
      {/* ── THE CIRCLE CONTAINER WITH THE ANIMATION INSIDE ── */}
      <View style={styles.circleOuterFrame}>
        
        {/* Subtle rotating decorative orbit ring */}
        <Animated.View
          style={[
            styles.decorativeRing,
            { transform: [{ rotate: ringRotate }] },
          ]}
        >
          <View style={styles.ringAccentDot} />
        </Animated.View>

        {/* ── INNER CIRCLE (ALL ANIMATION FRAMED INSIDE) ── */}
        <View style={styles.circleInnerStage}>

          {/* Pitch Turf & Popping Crease */}
          <View style={styles.pitchMat}>
            <View style={styles.creaseLine} />
            <View style={styles.stumpMarkings} />
          </View>

          {/* Pitch Bounce Dust Puff */}
          <Animated.View
            style={[
              styles.pitchPuff,
              {
                opacity: pitchPuffOpacity,
                transform: [{ scale: pitchPuffScale }],
              },
            ]}
          />

          {/* Shockwave ring at stumps base */}
          <Animated.View
            style={[
              styles.shockwaveRing,
              {
                opacity: shockwaveOpacity,
                transform: [{ scale: shockwaveScale }],
              },
            ]}
          />

          {/* Impact Flying Sparks */}
          <Animated.View
            style={[
              styles.sparkPiece,
              {
                opacity: sparkAnim,
                transform: [
                  { translateX: Animated.multiply(sparkSpread, 1.2) },
                  { translateY: Animated.multiply(sparkSpread, -1.4) },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.sparkPiece,
              {
                backgroundColor: '#ef4444',
                opacity: sparkAnim,
                transform: [
                  { translateX: Animated.multiply(sparkSpread, -1.2) },
                  { translateY: Animated.multiply(sparkSpread, -1.2) },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.sparkPiece,
              {
                backgroundColor: '#fbbf24',
                opacity: sparkAnim,
                transform: [
                  { translateX: Animated.multiply(sparkSpread, 0.4) },
                  { translateY: Animated.multiply(sparkSpread, -1.6) },
                ],
              },
            ]}
          />

          {/* Impact Explosion Flash */}
          <Animated.View
            style={[
              styles.impactFlash,
              {
                opacity: impactFlashOpacity,
                transform: [{ scale: impactFlashScale }],
              },
            ]}
          />

          {/* ── THE 3 WICKETS & 2 BAILS (FLYING / CARTWHEELING) ── */}
          <Animated.View style={[styles.wicketsLayer, { opacity: stumpsGroupOpacity }]}>

            {/* 1. LEFT BAIL (Flies high up-left) */}
            <Animated.View
              style={[
                styles.bailLeft,
                {
                  opacity: leftBailOpacity,
                  transform: [
                    { translateX: leftBailX },
                    { translateY: leftBailY },
                    { rotate: leftBailRotStr },
                  ],
                },
              ]}
            >
              <Animated.View style={[styles.ledBailGlow, { opacity: ledGlowOpacity }]} />
            </Animated.View>

            {/* 2. RIGHT BAIL (Flies high up-right) */}
            <Animated.View
              style={[
                styles.bailRight,
                {
                  opacity: rightBailOpacity,
                  transform: [
                    { translateX: rightBailX },
                    { translateY: rightBailY },
                    { rotate: rightBailRotStr },
                  ],
                },
              ]}
            >
              <Animated.View style={[styles.ledBailGlow, { opacity: ledGlowOpacity }]} />
            </Animated.View>

            {/* 3. LEG STUMP (Left) */}
            <Animated.View
              style={[
                styles.stumpLeg,
                {
                  opacity: legStumpOpacity,
                  transform: [
                    { translateX: legStumpX },
                    { translateY: legStumpY },
                    { rotate: legRotStr },
                  ],
                },
              ]}
            >
              <View style={styles.stumpCap} />
              <Animated.View style={[styles.ledStumpStrip, { opacity: ledGlowOpacity }]} />
            </Animated.View>

            {/* 4. MIDDLE STUMP (Center - takes direct hit & cartwheels!) */}
            <Animated.View
              style={[
                styles.stumpMiddle,
                {
                  opacity: middleStumpOpacity,
                  transform: [
                    { translateX: middleStumpX },
                    { translateY: middleStumpY },
                    { rotate: midRotStr },
                  ],
                },
              ]}
            >
              <View style={styles.stumpCap} />
              <Animated.View style={[styles.ledStumpStrip, { opacity: ledGlowOpacity }]} />
            </Animated.View>

            {/* 5. OFF STUMP (Right - flies right) */}
            <Animated.View
              style={[
                styles.stumpOff,
                {
                  opacity: offStumpOpacity,
                  transform: [
                    { translateX: offStumpX },
                    { translateY: offStumpY },
                    { rotate: offRotStr },
                  ],
                },
              ]}
            >
              <View style={styles.stumpCap} />
              <Animated.View style={[styles.ledStumpStrip, { opacity: ledGlowOpacity }]} />
            </Animated.View>

          </Animated.View>

          {/* ── THE CRICKET BALL (~20px) ── */}
          <Animated.View
            style={[
              styles.ballWrap,
              {
                opacity: ballOpacity,
                transform: [
                  { translateX: ballX },
                  { translateY: ballY },
                  { scale: ballScale },
                ],
              },
            ]}
          >
            <View style={styles.cricketBall}>
              <View style={styles.ballShine} />
              <Animated.View
                style={[
                  styles.ballSeamWrap,
                  { transform: [{ rotate: seamRotate }] },
                ]}
              >
                <View style={styles.seamRidge} />
              </Animated.View>
              <View style={styles.ballCore} />
            </View>
          </Animated.View>

        </View>
      </View>

    </View>
  );

  return content;
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f2e9', // UNIFORM FULL SCREEN HOME PAGE COLOR
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    zIndex: 999999,
    elevation: 999999,
    backgroundColor: '#f6f2e9', // UNIFORM FULL SCREEN HOME PAGE COLOR
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── CIRCLE OUTER FRAME ──
  circleOuterFrame: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  decorativeRing: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 1.5,
    borderColor: '#e5dec9',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ringAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d4af37',
    marginTop: -3,
    shadowColor: '#d4af37',
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },

  // ── INNER CIRCLE STAGE (OVERFLOW HIDDEN TO FRAME THE ACTION) ──
  circleInnerStage: {
    width: 196,
    height: 196,
    borderRadius: 98,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5dec9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    shadowColor: '#854d0e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },

  // ── PITCH TURF ──
  pitchMat: {
    width: 170,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    zIndex: 1,
  },
  creaseLine: {
    width: 130,
    height: 1.5,
    backgroundColor: '#ffffff',
  },
  stumpMarkings: {
    position: 'absolute',
    width: 26,
    height: 2,
    backgroundColor: '#ffffff',
    bottom: 2,
  },
  pitchPuff: {
    position: 'absolute',
    left: 64,
    bottom: 22,
    width: 18,
    height: 7,
    borderRadius: 9,
    backgroundColor: 'rgba(203, 213, 225, 0.8)',
    zIndex: 2,
  },

  // ── COLLISION SHOCKWAVE & FLASH ──
  shockwaveRing: {
    position: 'absolute',
    bottom: 22,
    width: 38,
    height: 12,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#ef4444',
    zIndex: 2,
  },
  impactFlash: {
    position: 'absolute',
    bottom: 34,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fbbf24',
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 10,
  },
  sparkPiece: {
    position: 'absolute',
    bottom: 42,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ef4444',
    zIndex: 10,
  },

  // ── WICKETS LAYER ──
  wicketsLayer: {
    position: 'absolute',
    bottom: 22,
    width: 36,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 5,
  },

  // BAILS
  bailLeft: {
    position: 'absolute',
    top: 0,
    left: 1,
    width: 15,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#f59e0b',
    borderWidth: 0.5,
    borderColor: '#78350f',
    zIndex: 6,
    overflow: 'hidden',
  },
  bailRight: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 15,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#f59e0b',
    borderWidth: 0.5,
    borderColor: '#78350f',
    zIndex: 6,
    overflow: 'hidden',
  },
  ledBailGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
  },

  // STUMPS (WOODEN + LED ZING STRIP)
  stumpLeg: {
    position: 'absolute',
    bottom: 0,
    left: 3,
    width: 4.5,
    height: 52,
    backgroundColor: '#f59e0b',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 0.5,
    borderColor: '#78350f',
    overflow: 'hidden',
  },
  stumpMiddle: {
    position: 'absolute',
    bottom: 0,
    left: 15.5,
    width: 5,
    height: 52,
    backgroundColor: '#d97706',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 0.5,
    borderColor: '#78350f',
    overflow: 'hidden',
  },
  stumpOff: {
    position: 'absolute',
    bottom: 0,
    right: 3,
    width: 4.5,
    height: 52,
    backgroundColor: '#f59e0b',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 0.5,
    borderColor: '#78350f',
    overflow: 'hidden',
  },
  stumpCap: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#fbbf24',
  },
  ledStumpStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
    opacity: 0.85,
  },

  // ── BALL (~20px) ──
  ballWrap: {
    position: 'absolute',
    bottom: 28,
    zIndex: 8,
  },
  cricketBall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b91c1c',
    borderWidth: 0.8,
    borderColor: '#7f1d1d',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#b91c1c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  ballShine: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 6,
    height: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    transform: [{ rotate: '-30deg' }],
  },
  ballSeamWrap: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seamRidge: {
    width: 1.5,
    height: 20,
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',
  },
  ballCore: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
});

export default CricketPreloader;
