/**
 * mobile_frontend/src/components/scorer/DeliveryInspectionModal.tsx
 *
 * Professional CricHeroes/TNCA style Delivery Inspection Modal.
 * Triggered when a scorer taps any past ball in the 'THIS OVER / RECENT DELIVERIES' strip.
 * Features dedicated visual cards for:
 * - 1, 2, 3 Runs & Dots (with Pitch trajectory graphic, runs badge, commentary)
 * - 4s & 6s (with Umpire boundary signals, celebration badges, and Wagon Wheel shot direction)
 * - No Balls (with Umpire No-Ball signal and illegal delivery reason)
 * - Wickets & Wides (with official signals and dismissal breakdown)
 * - Direct "Edit This Ball" action button to allow retroactive ball correction.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import Svg, { Rect, Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const IMG_UMPIRE_FOUR = require('../../../assets/umpire/umpire_four.jpg');
const IMG_UMPIRE_SIX = require('../../../assets/umpire/umpire_six.jpg');
const IMG_UMPIRE_NOBALL = require('../../../assets/umpire/umpire_noball.png');
const IMG_UMPIRE_OUT = require('../../../assets/umpire/umpire_out.png');
const IMG_UMPIRE_WIDE = require('../../../assets/umpire/umpire_wide.png');

export interface DeliveryInspectionModalProps {
  visible: boolean;
  delivery: any | null;
  onClose: () => void;
  onEdit: (del: any) => void;
  strikerName?: string;
  bowlerName?: string;
}

export const DeliveryInspectionModal: React.FC<DeliveryInspectionModalProps> = ({
  visible,
  delivery,
  onClose,
  onEdit,
  strikerName,
  bowlerName
}) => {
  if (!visible || !delivery) return null;

  const ballText = String(delivery.ball || '12.5');
  const dt = String(delivery.text ?? '').toUpperCase();
  const runs = typeof delivery.runsBatter === 'number'
    ? delivery.runsBatter
    : (typeof delivery.runs === 'number' ? delivery.runs : 0);
  const extraType = (delivery.extraType || delivery.extra_type || delivery.extra || '').toUpperCase();
  const isNoBall = extraType === 'NO_BALL' || dt === 'NB' || dt.includes('NB');
  const isWide = extraType === 'WIDE' || dt === 'WD' || dt.includes('WD');
  const isWicket = Boolean(delivery.wicket) || dt === 'W' || dt.includes('W');
  const isSix = runs === 6 || dt === '6';
  const isFour = runs === 4 || dt === '4';

  const sector = delivery.shotZone || delivery.shot_zone || delivery.wagonSector || (isSix ? 'Long-On' : 'Extra Cover');
  const batter = delivery.strikerName || strikerName || 'Batter';
  const bowler = delivery.bowlerName || bowlerName || 'Bowler';

  // Determine commentary & shot description
  let commentaryText = delivery.commentary || '';
  if (!commentaryText) {
    if (isNoBall) {
      commentaryText = 'Illegal delivery (e.g. overstep / height). Free hit awarded to batting team.';
    } else if (isWide) {
      commentaryText = 'Delivery passed outside the off-stump tramline (+1 extra run).';
    } else if (isWicket) {
      const wType = delivery.wicketType || 'Out';
      commentaryText = `${batter} dismissed (${wType}) b ${bowler}.`;
    } else if (isSix) {
      commentaryText = `Cleared the ropes over ${sector} (${delivery.distance || '84'}m). Fantastic maximum!`;
    } else if (isFour) {
      commentaryText = `Nice shot! Driven past ${sector} to the boundary.`;
    } else if (runs === 2) {
      commentaryText = `Worked into the gap towards ${sector || 'Cover'}, easy double taken.`;
    } else if (runs === 1) {
      commentaryText = `Pushed into the gap towards ${sector || 'Cover'}, quick single taken.`;
    } else if (runs === 3) {
      commentaryText = `Driven into the deep towards ${sector || 'Long-Off'}, excellent running between the wickets for three.`;
    } else if (runs === 0) {
      commentaryText = 'Good length delivery on off stump, defended solidly to the fielder.';
    } else {
      commentaryText = `Scored ${runs} runs off the bat with aggressive running.`;
    }
  }

  const handleEditClick = () => {
    onClose();
    onEdit(delivery);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.cardContainer}>
          {/* ═════════════════════════════════════════════════════════════════════
              CASE 1: NO BALL (Image 6)
             ═════════════════════════════════════════════════════════════════════ */}
          {isNoBall ? (
            <>
              {/* Top Banner with Red Ball Pill */}
              <View style={[styles.graphicBannerWrapper, { backgroundColor: '#1e293b' }]}>
                <Image
                  source={IMG_UMPIRE_NOBALL}
                  style={styles.umpireHeaderImg}
                  resizeMode="cover"
                />
                <View style={styles.bannerDarkGradientOverlay} />

                {/* Pill Top Left */}
                <View style={[styles.headerPill, styles.headerPillRed]}>
                  <Text style={styles.headerPillRedText}>Ball {ballText}</Text>
                </View>

                {/* Close Button Top Right */}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>

                {/* Flying Ball Graphic & No Ball Banner */}
                <View style={styles.noBallBannerBadge}>
                  <Text style={styles.noBallBannerText}>No Ball!</Text>
                </View>
              </View>

              {/* Content Body */}
              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  <View style={styles.iconCircleRed}>
                    <Text style={{ fontSize: 24 }}>🚫</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentTitle}>No Ball!</Text>
                    <Text style={styles.contentSubtitle}>
                      {delivery.reason || 'Illegal delivery (e.g. overstep / height).'}
                    </Text>
                  </View>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Use 'No Ball' button to continue.
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : isSix ? (
            /* ═════════════════════════════════════════════════════════════════════
                CASE 2: SIX RUNS (Image 4)
               ═════════════════════════════════════════════════════════════════════ */
            <>
              <View style={[styles.graphicBannerWrapper, { backgroundColor: '#172554' }]}>
                <Image
                  source={IMG_UMPIRE_SIX}
                  style={styles.umpireHeaderImg}
                  resizeMode="cover"
                />
                <View style={styles.bannerDarkGradientOverlay} />

                {/* Pill Top Left */}
                <View style={[styles.headerPill, styles.headerPillYellow]}>
                  <Text style={styles.headerPillYellowText}>Ball {ballText}</Text>
                </View>

                {/* Close Button Top Right */}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>

                {/* 6 RUNS Big Celebration Badge */}
                <View style={styles.sixRunsBadgeWrap}>
                  <Text style={styles.sixHugeNumber}>6</Text>
                  <View style={styles.runsPillNavy}>
                    <Text style={styles.runsPillNavyText}>RUNS!</Text>
                  </View>
                </View>
              </View>

              {/* Content Body */}
              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  <View style={styles.ballIconWrap}>
                    <Text style={{ fontSize: 24 }}>🔴</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentTitle}>Fantastic shot!</Text>
                    <Text style={styles.contentSubtitle}>
                      Cleared the ropes over <Text style={{ fontWeight: '800', color: '#1e293b' }}>{sector}</Text>{delivery.distance ? ` (${delivery.distance}m)` : ' (84m)'}
                    </Text>
                  </View>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Activate 'Edit Mode' to modify past deliveries directly.
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : isFour ? (
            /* ═════════════════════════════════════════════════════════════════════
                CASE 3: FOUR RUNS (Image 5)
               ═════════════════════════════════════════════════════════════════════ */
            <>
              <View style={[styles.graphicBannerWrapper, { backgroundColor: '#172554' }]}>
                <Image
                  source={IMG_UMPIRE_FOUR}
                  style={styles.umpireHeaderImg}
                  resizeMode="cover"
                />
                <View style={styles.bannerDarkGradientOverlay} />

                {/* Pill Top Left */}
                <View style={[styles.headerPill, styles.headerPillYellow]}>
                  <Text style={styles.headerPillYellowText}>Ball {ballText}</Text>
                </View>

                {/* Close Button Top Right */}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>

                {/* 4 RUNS Big Badge */}
                <View style={styles.fourRunsBadgeWrap}>
                  <Text style={styles.fourHugeNumber}>4</Text>
                  <View style={styles.runsPillNavy}>
                    <Text style={styles.runsPillNavyText}>RUNS!</Text>
                  </View>
                </View>
              </View>

              {/* Content Body */}
              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  <View style={styles.ballIconWrap}>
                    <Text style={{ fontSize: 24 }}>🔴</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentTitle}>Four Runs!</Text>
                    <Text style={styles.contentSubtitle}>
                      Nice shot! Driven past <Text style={{ fontWeight: '800', color: '#1e293b' }}>{sector}</Text> to the boundary.
                    </Text>
                  </View>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Use 'Edit Mode' to modify past deliveries directly.
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : isWicket ? (
            /* ═════════════════════════════════════════════════════════════════════
                CASE 4: WICKET / DISMISSAL
               ═════════════════════════════════════════════════════════════════════ */
            <>
              <View style={[styles.graphicBannerWrapper, { backgroundColor: '#450a0a' }]}>
                <Image
                  source={IMG_UMPIRE_OUT}
                  style={styles.umpireHeaderImg}
                  resizeMode="cover"
                />
                <View style={styles.bannerDarkGradientOverlay} />

                <View style={[styles.headerPill, styles.headerPillRed]}>
                  <Text style={styles.headerPillRedText}>Ball {ballText}</Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.wicketBannerBadge}>
                  <Text style={styles.wicketBannerText}>BATTER OUT!</Text>
                </View>
              </View>

              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  <View style={styles.iconCircleRed}>
                    <Text style={{ fontSize: 24 }}>☝️</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentTitle}>Wicket Dismissal!</Text>
                    <Text style={styles.contentSubtitle}>{commentaryText}</Text>
                  </View>
                </View>

                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Use 'Edit Mode' if this dismissal was reversed or given incorrectly.
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : isWide ? (
            /* ═════════════════════════════════════════════════════════════════════
                CASE 5: WIDE BALL
               ════════════════════════════════════════════─═════════════════════════ */
            <>
              <View style={[styles.graphicBannerWrapper, { backgroundColor: '#431407' }]}>
                <Image
                  source={IMG_UMPIRE_WIDE}
                  style={styles.umpireHeaderImg}
                  resizeMode="cover"
                />
                <View style={styles.bannerDarkGradientOverlay} />

                <View style={[styles.headerPill, styles.headerPillYellow]}>
                  <Text style={styles.headerPillYellowText}>Ball {ballText}</Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.wideBannerBadge}>
                  <Text style={styles.wideBannerText}>Wide Ball!</Text>
                </View>
              </View>

              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  <View style={styles.ballIconWrap}>
                    <Text style={{ fontSize: 24 }}>↔️</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentTitle}>Wide Delivery!</Text>
                    <Text style={styles.contentSubtitle}>
                      {commentaryText || 'Delivery passed outside the off-stump tramline (+1 extra run).'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Use 'Edit Mode' to alter extra runs or re-bowl status.
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            /* ═════════════════════════════════════════════════════════════════════
                CASE 6: 1, 2, 3 RUNS & DOT BALLS (Image 3)
               ═════════════════════════════════════════════════════════════════════ */
            <>
              {/* Dark Navy Curved Header with Batsman Silhouette */}
              <View style={styles.curvedNavyHeader}>
                <View style={styles.headerBatsmanSilhouette}>
                  <Text style={{ fontSize: 22 }}>🏏</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.headerBallTitleText}>Ball </Text>
                  <Text style={styles.headerBallNumberGold}>{ballText}</Text>
                </View>

                {/* Close Button Top Right */}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtnNavy}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeCircleBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Graphic Pitch Trajectory SVG Illustration */}
              <View style={styles.pitchGraphicContainer}>
                <Svg width="100%" height={140} viewBox="0 0 380 140">
                  <Defs>
                    <SvgLinearGradient id="pitchSky" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#1e293b" />
                      <Stop offset="50%" stopColor="#334155" />
                      <Stop offset="100%" stopColor="#475569" />
                    </SvgLinearGradient>
                    <SvgLinearGradient id="fieldGrass" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#15803d" />
                      <Stop offset="100%" stopColor="#166534" />
                    </SvgLinearGradient>
                    <SvgLinearGradient id="pitchClay" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#d97706" />
                      <Stop offset="100%" stopColor="#b45309" />
                    </SvgLinearGradient>
                  </Defs>

                  {/* Sky & Stadium Crowd Horizon */}
                  <Rect x="0" y="0" width="380" height="70" fill="url(#pitchSky)" />

                  {/* Outfield Grass */}
                  <Rect x="0" y="65" width="380" height="75" fill="url(#fieldGrass)" />

                  {/* Center Turf Pitch Perspective */}
                  <Path
                    d="M 140 70 L 240 70 L 270 140 L 110 140 Z"
                    fill="url(#pitchClay)"
                    opacity={0.88}
                  />

                  {/* Pitch Crease Lines */}
                  <Path d="M 155 76 L 225 76" stroke="#ffffff" strokeWidth="1.5" opacity={0.7} />
                  <Path d="M 125 125 L 255 125" stroke="#ffffff" strokeWidth="2" opacity={0.8} />

                  {/* Wooden Stumps at Far End */}
                  <Rect x="186" y="60" width="2" height="12" fill="#fef08a" />
                  <Rect x="190" y="60" width="2" height="12" fill="#fef08a" />
                  <Rect x="194" y="60" width="2" height="12" fill="#fef08a" />
                  <Rect x="185" y="59" width="12" height="1.8" fill="#fef08a" />

                  {/* White Curved Ball Trajectory Arc */}
                  <Path
                    d="M 130 120 Q 200 45 285 92"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="4 3"
                    fill="none"
                  />

                  {/* 3D Red Cricket Ball with Glow */}
                  <Circle cx="285" cy="92" r="14" fill="#dc2626" />
                  <Circle cx="280" cy="88" r="4.5" fill="#f87171" opacity={0.65} />
                  {/* Seam */}
                  <Path
                    d="M 273 92 Q 285 86 297 92"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeDasharray="1.5 1.5"
                    fill="none"
                  />
                </Svg>
              </View>

              {/* Middle Section: Circle Badge + Commentary */}
              <View style={styles.contentBody}>
                <View style={styles.detailRow}>
                  {/* Circular Badge */}
                  <View style={styles.runsCircleBadge}>
                    <Text style={styles.runsCircleNumber}>{runs}</Text>
                    <Text style={styles.runsCircleLabel}>{runs === 1 ? 'Run' : runs === 0 ? 'Dot' : 'Runs'}</Text>
                  </View>

                  <View style={styles.verticalDivider} />

                  {/* Text Description */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commentaryProseText}>
                      {commentaryText}
                    </Text>
                  </View>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    <Text style={{ fontWeight: '700' }}>Tip:</Text> Activate 'Edit Mode' in the sidebar or top banner to modify past deliveries directly.
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editBallBtn}
                    onPress={handleEditClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.okBtnText}>✓ OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.45)'
      },
      default: {
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20
      }
    })
  },

  // 1. Graphic Banner Wrappers
  graphicBannerWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  umpireHeaderImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  bannerDarkGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.28)'
  },

  // Header Pills
  headerPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.2
  },
  headerPillRed: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626'
  },
  headerPillRedText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  headerPillYellow: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde047'
  },
  headerPillYellowText: {
    color: '#854d0e',
    fontSize: 13,
    fontWeight: '800'
  },

  // Close Circle Buttons
  closeCircleBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  closeCircleBtnNavy: {
    position: 'absolute',
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeCircleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },

  // Large Overlay Badges (Six, Four, No Ball, Wicket)
  sixRunsBadgeWrap: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sixHugeNumber: {
    fontSize: 68,
    fontWeight: '900',
    color: '#fbbf24',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6
  },
  fourRunsBadgeWrap: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  fourHugeNumber: {
    fontSize: 68,
    fontWeight: '900',
    color: '#facc15',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6
  },
  runsPillNavy: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    transform: [{ rotate: '-8deg' }]
  },
  runsPillNavyText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  noBallBannerBadge: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    transform: [{ rotate: '-4deg' }],
    borderWidth: 1.5,
    borderColor: '#ffffff'
  },
  noBallBannerText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  wicketBannerBadge: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    backgroundColor: '#b91c1c',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff'
  },
  wicketBannerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  wideBannerBadge: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff'
  },
  wideBannerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.8
  },

  // Curved Navy Header (Case 6)
  curvedNavyHeader: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  headerBatsmanSilhouette: {
    position: 'absolute',
    left: 16
  },
  headerBallTitleText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800'
  },
  headerBallNumberGold: {
    color: '#f59e0b',
    fontSize: 22,
    fontWeight: '900'
  },
  pitchGraphicContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#1e293b',
    overflow: 'hidden'
  },

  // Content Body
  contentBody: {
    padding: 18
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  runsCircleBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#f59e0b',
    backgroundColor: '#fffdf5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  runsCircleNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: 28
  },
  runsCircleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  verticalDivider: {
    width: 1.2,
    height: 48,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 14
  },
  commentaryProseText: {
    fontSize: 14.5,
    color: '#1e293b',
    lineHeight: 21,
    fontWeight: '500'
  },
  ballIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconCircleRed: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 3
  },
  contentSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18
  },

  // Tip Box
  tipBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  tipIcon: {
    fontSize: 16
  },
  tipText: {
    fontSize: 12,
    color: '#1e40af',
    flex: 1,
    lineHeight: 16
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },
  editBallBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1.5,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBallBtnText: {
    color: '#0284c7',
    fontSize: 13,
    fontWeight: '700'
  },
  okBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 10px rgba(245, 158, 11, 0.35)'
      },
      default: {
        elevation: 3
      }
    })
  },
  okBtnText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5
  }
});

export default DeliveryInspectionModal;
