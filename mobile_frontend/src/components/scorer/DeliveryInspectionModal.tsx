/**
 * mobile_frontend/src/components/scorer/DeliveryInspectionModal.tsx
 *
 * Professional CricHeroes/TNCA Delivery Inspection & Breakdown Modal.
 * Displays dedicated visual popups for:
 * - Wickets: Bowled, Caught (with who caught the ball), LBW, Run Out, Stumped with reasons why out
 * - Overthrow: Extra runs conceded on stray throws
 * - Dot Ball: No runs scored breakdown
 * - Wide: Tramline extra penalty
 * - No Ball: Overstep / height reasons
 * - Boundaries (4s & 6s): Wagon wheel sectors / sides
 * - 1, 2, 3 Runs: Running between wickets
 *
 * All popups maintain strict visual size consistency with identical 16:9 banner dimensions,
 * ball badges, why-out/reason breakdowns, and direct '✏️ Edit Ball' retroactive action buttons.
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
  Platform,
  ScrollView
} from 'react-native';

const POPUP_BOWLED = require('../../../assets/popups/popup_bowled.jpg');
const POPUP_CAUGHT = require('../../../assets/popups/popup_caught.jpg');
const POPUP_OVERTHROW = require('../../../assets/popups/popup_overthrow.jpg');
const POPUP_DOTBALL = require('../../../assets/popups/popup_dotball.jpg');
const POPUP_WIDE = require('../../../assets/popups/popup_wide.jpg');
const POPUP_EXTRA = require('../../../assets/popups/popup_extra.jpg');

const IMG_UMPIRE_FOUR = require('../../../assets/umpire/umpire_four.jpg');
const IMG_UMPIRE_SIX = require('../../../assets/umpire/umpire_six.jpg');
const IMG_UMPIRE_NOBALL = require('../../../assets/umpire/umpire_noball.png');

export interface DeliveryInspectionModalProps {
  visible: boolean;
  delivery: any | null;
  onClose: () => void;
  onEdit: (del: any) => void;
  strikerName?: string;
  bowlerName?: string;
  fielderName?: string;
}

export const DeliveryInspectionModal: React.FC<DeliveryInspectionModalProps> = ({
  visible,
  delivery,
  onClose,
  onEdit,
  strikerName,
  bowlerName,
  fielderName
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

  const commentaryLower = (delivery.commentary || '').toLowerCase();
  const isOverthrow = Boolean(delivery.isOverthrow || delivery.is_overthrow || commentaryLower.includes('overthrow'));

  const wicketTypeRaw = String(delivery.wicketType || delivery.wicket_type || '').toUpperCase();
  const isCaught = isWicket && (wicketTypeRaw.includes('CAUGHT') || commentaryLower.includes('caught') || wicketTypeRaw.includes('CT'));
  const isBowled = isWicket && (wicketTypeRaw.includes('BOWLED') || commentaryLower.includes('bowled') || (!isCaught && !wicketTypeRaw.includes('RUN') && !wicketTypeRaw.includes('LBW') && !wicketTypeRaw.includes('STUMP')));
  const isLBW = isWicket && (wicketTypeRaw.includes('LBW') || commentaryLower.includes('lbw'));
  const isRunOut = isWicket && (wicketTypeRaw.includes('RUN_OUT') || wicketTypeRaw.includes('RUN OUT') || commentaryLower.includes('run out'));
  const isStumped = isWicket && (wicketTypeRaw.includes('STUMP') || commentaryLower.includes('stump'));

  const isDotBall = !isWicket && !isWide && !isNoBall && runs === 0 && (delivery.runsExtras || 0) === 0;

  const sector = delivery.shotZone || delivery.shot_zone || delivery.wagonSector || (isSix ? 'Long-On' : 'Extra Cover');
  const batter = delivery.strikerName || strikerName || 'Batter';
  const bowler = delivery.bowlerName || bowlerName || 'Bowler';
  const catcher = delivery.fielderName || fielderName || (isCaught ? (delivery.dismissalText?.match(/c\s+([^b]+)\s+b/i)?.[1]?.trim() || 'Deep Fielder') : '');

  // Select matching image for exact 200px uniform banner
  let bannerImageSource: any = null;
  let bannerBadgeBg = '#f59e0b';
  let bannerBadgeText = `Ball ${ballText}`;
  let bannerType: 'CAUGHT' | 'BOWLED' | 'OTHER_WICKET' | 'OVERTHROW' | 'DOT' | 'WIDE' | 'SIX' | 'FOUR' | 'NO_BALL' | 'RUNS' = 'RUNS';

  if (isOverthrow) {
    bannerType = 'OVERTHROW';
    bannerImageSource = POPUP_OVERTHROW;
    bannerBadgeBg = '#2563eb';
  } else if (isCaught) {
    bannerType = 'CAUGHT';
    bannerImageSource = POPUP_CAUGHT;
    bannerBadgeBg = '#dc2626';
  } else if (isBowled) {
    bannerType = 'BOWLED';
    bannerImageSource = POPUP_BOWLED;
    bannerBadgeBg = '#b91c1c';
  } else if (isWicket) {
    bannerType = 'OTHER_WICKET';
    bannerImageSource = POPUP_BOWLED;
    bannerBadgeBg = '#b91c1c';
  } else if (isNoBall) {
    bannerType = 'NO_BALL';
    bannerImageSource = IMG_UMPIRE_NOBALL;
    bannerBadgeBg = '#dc2626';
  } else if (isWide) {
    bannerType = 'WIDE';
    bannerImageSource = POPUP_WIDE;
    bannerBadgeBg = '#ea580c';
  } else if (isSix) {
    bannerType = 'SIX';
    bannerImageSource = IMG_UMPIRE_SIX;
    bannerBadgeBg = '#2563eb';
  } else if (isFour) {
    bannerType = 'FOUR';
    bannerImageSource = IMG_UMPIRE_FOUR;
    bannerBadgeBg = '#059669';
  } else if (isDotBall) {
    bannerType = 'DOT';
    bannerImageSource = POPUP_DOTBALL;
    bannerBadgeBg = '#475569';
  } else {
    bannerType = 'RUNS';
    bannerImageSource = POPUP_EXTRA;
    bannerBadgeBg = '#0284c7';
  }

  // Generate detailed breakdown of why out, reasons, and wagon wheel sides
  let titleText = '';
  let subtitleText = '';
  let whyOutReason = '';
  let tipText = '';
  let iconEmoji = '🏏';

  if (bannerType === 'CAUGHT') {
    iconEmoji = '🤲';
    titleText = 'CAUGHT OUT!';
    subtitleText = `c ${catcher || 'Fielder'} b ${bowler}`;
    whyOutReason = `Why Out: Lofted shot towards ${sector}, caught cleanly by ${catcher || 'the fielder'}. Batter dismissed.`;
    tipText = "Tip: Verify catcher & bowler in official match scorecard or click 'Edit Ball' to correct.";
  } else if (bannerType === 'BOWLED') {
    iconEmoji = '🎯';
    titleText = 'BOWLED OUT!';
    subtitleText = `b ${bowler}`;
    whyOutReason = `Why Out: Clean bowled! Beat the defensive stroke and shattered the stumps, dislodging the bails.`;
    tipText = "Tip: Use 'Edit Ball' if the delivery was called a no-ball or decision was reversed.";
  } else if (bannerType === 'OTHER_WICKET') {
    iconEmoji = '☝️';
    if (isLBW) {
      titleText = 'LBW DISMISSAL!';
      subtitleText = `lbw b ${bowler}`;
      whyOutReason = `Why Out: Struck in front of middle stump. Ball pitched in line and would have hit the stumps.`;
    } else if (isRunOut) {
      titleText = 'RUN OUT!';
      subtitleText = `run out (${catcher || 'Fielder'})`;
      whyOutReason = `Why Out: Direct throw hit the stumps while ${batter} was stranded short of the popping crease.`;
    } else if (isStumped) {
      titleText = 'STUMPED!';
      subtitleText = `st †Keeper b ${bowler}`;
      whyOutReason = `Why Out: Batter dragged foot out of crease, wicketkeeper whipped off bails cleanly.`;
    } else {
      titleText = 'BATTER DISMISSED!';
      subtitleText = `${batter} is OUT`;
      whyOutReason = delivery.dismissalText || `Why Out: Batter dismissed by official umpire decision.`;
    }
    tipText = "Tip: Use 'Edit Ball' to modify dismissal type or reverse wicket.";
  } else if (bannerType === 'OVERTHROW') {
    iconEmoji = '⚡';
    titleText = `OVERTHROW! +${runs} RUNS`;
    subtitleText = `${batter} took advantage of fielding mishap`;
    whyOutReason = `Fielding throw from ${sector || 'the deep'} missed the stumps and backup fielder, enabling ${runs} extra overthrow runs.`;
    tipText = "Tip: Overthrow runs count toward batter's total if off the bat, or extras as designated.";
  } else if (bannerType === 'DOT') {
    iconEmoji = '🛡️';
    titleText = 'DOT BALL! No Runs';
    subtitleText = `Bowled by ${bowler} to ${batter}`;
    whyOutReason = `Good length delivery defended solidly into ${sector || 'Cover'}. No runs conceded (Dot ball recorded).`;
    tipText = "Tip: Dot balls build bowler pressure and lower required economy rate.";
  } else if (bannerType === 'WIDE') {
    iconEmoji = '↔️';
    titleText = 'WIDE BALL! +1 Run';
    subtitleText = `Bowled by ${bowler}`;
    whyOutReason = `Delivery bowled outside the official tramline marker. +1 extra penalty run added to team total, ball must be re-bowled.`;
    tipText = "Tip: Wide balls do not count as legal balls in the over.";
  } else if (bannerType === 'NO_BALL') {
    iconEmoji = '🚫';
    titleText = 'NO BALL! +1 Penalty Run';
    subtitleText = `Bowler overstepped / illegal height`;
    whyOutReason = delivery.reason || `Illegal delivery (e.g. overstep / height). Free hit awarded to batting team on next legal ball.`;
    tipText = "Tip: Mandatory Free Hit follows for the next delivery.";
  } else if (bannerType === 'SIX') {
    iconEmoji = '💥';
    titleText = 'FANTASTIC MAXIMUM! (6)';
    subtitleText = `Smashed by ${batter} off ${bowler}`;
    whyOutReason = `Cleared the boundary ropes over ${sector} (${delivery.distance || '86'}m). Huge six!`;
    tipText = "Tip: Wagon wheel shot sector and distance recorded for tournament analytics.";
  } else if (bannerType === 'FOUR') {
    iconEmoji = '🏏';
    titleText = 'FOUR RUNS! (4)';
    subtitleText = `Driven by ${batter} off ${bowler}`;
    whyOutReason = `Cracking shot! Driven past ${sector} to the boundary ropes for four.`;
    tipText = "Tip: Wagon wheel boundary trajectory mapped to playing sector.";
  } else {
    iconEmoji = '🏃';
    titleText = `${runs} ${runs === 1 ? 'RUN' : 'RUNS'} SCORED`;
    subtitleText = `Running between wickets by ${batter}`;
    whyOutReason = `Pushed into the gap towards ${sector || 'Cover'}, quick running completed.`;
    tipText = "Tip: Strike rotates for odd runs completed.";
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
              UNIFORM EXACT 200px HEIGHT BANNER FOR ALL POPUP IMAGES
             ═════════════════════════════════════════════════════════════════════ */}
          <View style={styles.uniformBannerWrap}>
            {bannerImageSource ? (
              <Image
                source={bannerImageSource}
                style={styles.uniformBannerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.uniformBannerImage, { backgroundColor: '#1e293b' }]} />
            )}

            {/* Gradient Overlay for Top Controls */}
            <View style={styles.bannerTopFadeGradient} />

            {/* Floating Top Left Pill: Ball X.Y */}
            <View style={[styles.headerPill, { backgroundColor: bannerBadgeBg }]}>
              <Text style={styles.headerPillText}>{bannerBadgeText}</Text>
            </View>

            {/* Floating Top Right Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeCircleBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.closeCircleBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* ═════════════════════════════════════════════════════════════════════
              CONTENT DETAILS (Who caught it, Why out, Reasons, Overthrows)
             ═════════════════════════════════════════════════════════════════════ */}
          <View style={styles.contentBody}>
            {/* 1. Main Headline Row */}
            <View style={styles.headlineRow}>
              <View style={styles.iconCircleBadge}>
                <Text style={{ fontSize: 26 }}>{iconEmoji}</Text>
              </View>
              <View style={styles.headlineTextCol}>
                <Text style={styles.mainTitle}>{titleText}</Text>
                <Text style={styles.subTitle} numberOfLines={1}>
                  {subtitleText}
                </Text>
              </View>
            </View>

            {/* 2. Structured Reason / Why Out / Field Details Box */}
            <View style={styles.reasonCardBox}>
              <Text style={styles.reasonCardText}>
                {whyOutReason}
              </Text>
            </View>

            {/* 3. Match Logistics Strip: Batter & Bowler & Catcher */}
            <View style={styles.playerStripRow}>
              <View style={styles.playerStripCol}>
                <Text style={styles.playerStripLabel}>🏏 BATTER</Text>
                <Text style={styles.playerStripValue} numberOfLines={1}>{batter}</Text>
              </View>
              <View style={styles.playerStripDivider} />
              <View style={styles.playerStripCol}>
                <Text style={styles.playerStripLabel}>🎯 BOWLER</Text>
                <Text style={styles.playerStripValue} numberOfLines={1}>{bowler}</Text>
              </View>
              {Boolean(catcher) && (
                <>
                  <View style={styles.playerStripDivider} />
                  <View style={styles.playerStripCol}>
                    <Text style={styles.playerStripLabel}>🤲 CAUGHT BY</Text>
                    <Text style={[styles.playerStripValue, { color: '#dc2626' }]} numberOfLines={1}>
                      {catcher}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* 4. Tip Box */}
            <View style={styles.tipBox}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{tipText}</Text>
            </View>

            {/* 5. Dual Action Buttons: Retroactive Ball Correction & OK */}
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
      },
      default: {
        elevation: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20
      }
    })
  },

  // EXACT SAME 200px HEIGHT BANNER FOR ALL POPUP IMAGES
  uniformBannerWrap: {
    width: '100%',
    height: 200,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden'
  },
  uniformBannerImage: {
    width: '100%',
    height: '100%'
  },
  bannerTopFadeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },

  // Top Left Floating Pill
  headerPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  headerPillText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },

  // Top Right Close Button
  closeCircleBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  closeCircleBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },

  // Content Body
  contentBody: {
    padding: 18
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  iconCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headlineTextCol: {
    flex: 1
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.3,
    marginBottom: 2
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b'
  },

  // Why Out / Details Reason Box
  reasonCardBox: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  reasonCardText: {
    fontSize: 13.5,
    color: '#1e293b',
    lineHeight: 19,
    fontWeight: '500'
  },

  // Player Strip Row
  playerStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12
  },
  playerStripCol: {
    flex: 1
  },
  playerStripLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 1
  },
  playerStripValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  playerStripDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8
  },

  // Tip Box
  tipBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  tipIcon: {
    fontSize: 15
  },
  tipText: {
    fontSize: 11.5,
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
