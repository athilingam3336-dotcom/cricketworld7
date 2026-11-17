/**
 * mobile_frontend/src/components/scorer/DeliveryInspectionModal.tsx
 *
 * Professional CricHeroes/TNCA Delivery Inspection & Breakdown Modal.
 * Displays dedicated 16:9 widescreen HD visual popups for:
 * - 🎯 Bowled: BOWLED OUT!
 * - 🤲 Caught: CAUGHT OUT! (with who caught the ball)
 * - ⚡ Run Out: RUN OUT! (direct throw, batter short of crease)
 * - 🧤 Stumping: STUMPED! (wicketkeeper whipping bails off)
 * - 🔥 LBW: LBW Out – LBW! (ball tracking, pad impact in line)
 * - 💥 Four Runs: BOUNDARY 4! (Wagon wheel shot side, striker, non-striker, bowler)
 * - 🚀 Six Runs: MAXIMUM 6! (Wagon wheel shot side, striker, non-striker, bowler)
 * - 🏃 Three Runs: 3 RUNS! (running between wickets)
 * - ⚡ Two Runs: 2 RUNS! (quick double, running between wickets)
 * - 🔄 One Run: 1 RUN! (strike rotation single)
 * - 🛡️ Dot Ball: NO RUN! (defensive stroke, 0 runs)
 * - ↔️ Wide: Tramline extra penalty
 * - 🚫 No Ball: Overstep / height reasons + Free Hit
 * - 💫 Overthrow: Extra runs conceded on stray throws
 *
 * Displays full professional logistics:
 * 1. Striker (who hit the ball / faced)
 * 2. Non-Striker (partner at bowler end)
 * 3. Bowler (who bowled the delivery)
 * 4. Fielder / Keeper (if caught, run out, stumped)
 * 5. Wagon Wheel Sector / Direction for all shots
 * 6. Direct '✏️ Edit Ball' retroactive action button
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
const POPUP_RUNOUT = require('../../../assets/popups/popup_runout.jpg');
const POPUP_STUMPED = require('../../../assets/popups/popup_stumped.jpg');
const POPUP_LBW = require('../../../assets/popups/popup_lbw.jpg');
const POPUP_4RUNS = require('../../../assets/popups/popup_4runs.jpg');
const POPUP_SIX = require('../../../assets/popups/popup_six.jpg');
const POPUP_3RUNS = require('../../../assets/popups/popup_3runs.jpg');
const POPUP_2RUNS = require('../../../assets/popups/popup_2runs.jpg');
const POPUP_1RUN = require('../../../assets/popups/popup_1run.jpg');
const POPUP_DOTBALL = require('../../../assets/popups/popup_dotball.jpg');
const POPUP_WIDE = require('../../../assets/popups/popup_wide.jpg');
const POPUP_NOBALL = require('../../../assets/popups/popup_noball.jpg');
const POPUP_OVERTHROW = require('../../../assets/popups/popup_overthrow.jpg');
const POPUP_DEADBALL = require('../../../assets/popups/popup_deadball.jpg');
const POPUP_EXTRA = require('../../../assets/popups/popup_extra.jpg');

export interface DeliveryInspectionModalProps {
  visible: boolean;
  delivery: any | null;
  onClose: () => void;
  onEdit: (del: any) => void;
  strikerName?: string;
  nonStrikerName?: string;
  bowlerName?: string;
  fielderName?: string;
  currentScore?: string;
  battingTeamName?: string;
}

export const DeliveryInspectionModal: React.FC<DeliveryInspectionModalProps> = ({
  visible,
  delivery,
  onClose,
  onEdit,
  strikerName,
  nonStrikerName,
  bowlerName,
  fielderName,
  currentScore,
  battingTeamName
}) => {
  if (!visible || !delivery) return null;

  const ballText = String(delivery.ball || '12.5');
  const dt = String(delivery.text ?? '').toUpperCase();
  const runsBatterNum = typeof delivery.runsBatter === 'number'
    ? delivery.runsBatter
    : (typeof delivery.runs === 'number' ? delivery.runs : 0);
  const runsExtrasNum = Number(delivery.runsExtras || delivery.runs_extras || 0);
  const totalRunsScored = typeof delivery.totalRuns === 'number'
    ? delivery.totalRuns
    : (typeof delivery.total_runs === 'number' ? delivery.total_runs : (runsBatterNum + runsExtrasNum));
  const runs = runsBatterNum;

  const extraType = String(delivery.extraType || delivery.extra_type || delivery.extra || '').toUpperCase();
  const isNoBall = extraType === 'NO_BALL' || dt === 'NB' || dt.startsWith('NB') || dt.includes('NO BALL');
  const isWide = extraType === 'WIDE' || dt === 'WD' || dt.startsWith('WD') || dt.includes('WIDE');
  const isWicket = Boolean(delivery.wicket) || (!isWide && !isNoBall && (dt === 'W' || dt === 'OUT' || (dt.includes('W') && !dt.includes('WD'))));
  const commentaryLower = (delivery.commentary || '').toLowerCase();
  const isOverthrow = Boolean(delivery.isOverthrow || delivery.is_overthrow || commentaryLower.includes('overthrow'));
  const isDeadBall = extraType === 'DEAD_BALL' || dt === 'DB' || commentaryLower.includes('dead ball');

  const isDotBall = !isWicket && !isWide && !isNoBall && !isDeadBall && totalRunsScored === 0;
  const isSix = !isWide && !isNoBall && !isWicket && (totalRunsScored === 6 || runs === 6 || dt === '6');
  const isFour = !isWide && !isNoBall && !isWicket && (totalRunsScored === 4 || runs === 4 || dt === '4');
  const isThreeRuns = !isWicket && !isWide && !isNoBall && totalRunsScored === 3;
  const isTwoRuns = !isWicket && !isWide && !isNoBall && totalRunsScored === 2;
  const isOneRun = !isWicket && !isWide && !isNoBall && totalRunsScored === 1;
  const isMoreRuns = !isWicket && !isWide && !isNoBall && !isOverthrow && totalRunsScored >= 5 && totalRunsScored !== 6;

  const wicketTypeRaw = String(delivery.wicketType || delivery.wicket_type || '').toUpperCase();
  const isCaught = isWicket && !isWide && (wicketTypeRaw.includes('CAUGHT') || commentaryLower.includes('caught') || wicketTypeRaw.includes('CT'));
  const isRunOut = isWicket && (wicketTypeRaw.includes('RUN_OUT') || wicketTypeRaw.includes('RUN OUT') || commentaryLower.includes('run out'));
  const isStumped = isWicket && (wicketTypeRaw.includes('STUMP') || commentaryLower.includes('stump'));
  const isLBW = isWicket && !isWide && (wicketTypeRaw.includes('LBW') || commentaryLower.includes('lbw'));
  const isBowled = isWicket && !isWide && !isNoBall && !isCaught && !isRunOut && !isStumped && !isLBW;

  // Shot zone / Wagon Wheel side
  const sector = delivery.shotZone || delivery.shot_zone || delivery.wagonSector || (
    isSix ? 'Deep Mid-Wicket' :
    isFour ? 'Extra Cover' :
    isThreeRuns ? 'Deep Long-Off' :
    isTwoRuns ? 'Square Leg' :
    isOneRun ? 'Point' : 'Cover'
  );

  const batter = delivery.strikerName || strikerName || 'Striker';
  const nonStriker = delivery.nonStrikerName || nonStrikerName || 'Non-Striker';
  const bowler = delivery.bowlerName || bowlerName || 'Bowler';
  const catcher = delivery.fielderName || fielderName || (
    isCaught ? (delivery.dismissalText?.match(/c\s+([^b]+)\s+b/i)?.[1]?.trim() || 'Deep Fielder') :
    isRunOut ? (delivery.dismissalText?.match(/\(([^)]+)\)/)?.[1]?.trim() || 'Fielder') :
    isStumped ? (delivery.dismissalText?.match(/st\s+†?([^b]+)\s+b/i)?.[1]?.trim() || 'Wicketkeeper') : ''
  );

  // Dedicated 16:9 Landscape Banner Image Selection
  let bannerImageSource: any = null;
  let bannerBadgeBg = '#f59e0b';
  let bannerBadgeText = `Ball ${ballText}`;
  let bannerType: 'CAUGHT' | 'BOWLED' | 'RUN_OUT' | 'STUMPED' | 'LBW' | 'OVERTHROW' | 'DOT' | 'WIDE' | 'DEAD_BALL' | 'SIX' | 'FOUR' | 'NO_BALL' | 'THREE_RUNS' | 'TWO_RUNS' | 'ONE_RUN' | 'MORE_RUNS' | 'RUNS' = 'RUNS';

  if (isRunOut) {
    bannerType = 'RUN_OUT';
    bannerImageSource = POPUP_RUNOUT;
    bannerBadgeBg = '#dc2626';
  } else if (isStumped) {
    bannerType = 'STUMPED';
    bannerImageSource = POPUP_STUMPED;
    bannerBadgeBg = '#7c3aed';
  } else if (isLBW) {
    bannerType = 'LBW';
    bannerImageSource = POPUP_LBW;
    bannerBadgeBg = '#ea580c';
  } else if (isCaught) {
    bannerType = 'CAUGHT';
    bannerImageSource = POPUP_CAUGHT;
    bannerBadgeBg = '#dc2626';
  } else if (isBowled) {
    bannerType = 'BOWLED';
    bannerImageSource = POPUP_BOWLED;
    bannerBadgeBg = '#b91c1c';
  } else if (isOverthrow) {
    bannerType = 'OVERTHROW';
    bannerImageSource = POPUP_OVERTHROW;
    bannerBadgeBg = '#2563eb';
  } else if (isNoBall) {
    bannerType = 'NO_BALL';
    bannerImageSource = POPUP_NOBALL;
    bannerBadgeBg = '#dc2626';
  } else if (isWide) {
    bannerType = 'WIDE';
    bannerImageSource = POPUP_WIDE;
    bannerBadgeBg = '#ea580c';
  } else if (isDeadBall) {
    bannerType = 'DEAD_BALL';
    bannerImageSource = POPUP_DEADBALL;
    bannerBadgeBg = '#475569';
  } else if (isSix) {
    bannerType = 'SIX';
    bannerImageSource = POPUP_SIX;
    bannerBadgeBg = '#2563eb';
  } else if (isFour) {
    bannerType = 'FOUR';
    bannerImageSource = POPUP_4RUNS;
    bannerBadgeBg = '#059669';
  } else if (isMoreRuns) {
    bannerType = 'MORE_RUNS';
    bannerImageSource = POPUP_1RUN; // Base running image with dynamic overlay
    bannerBadgeBg = '#7c3aed';
  } else if (isThreeRuns) {
    bannerType = 'THREE_RUNS';
    bannerImageSource = POPUP_3RUNS;
    bannerBadgeBg = '#0284c7';
  } else if (isTwoRuns) {
    bannerType = 'TWO_RUNS';
    bannerImageSource = POPUP_2RUNS;
    bannerBadgeBg = '#0284c7';
  } else if (isOneRun) {
    bannerType = 'ONE_RUN';
    bannerImageSource = POPUP_1RUN;
    bannerBadgeBg = '#0284c7';
  } else if (isDotBall) {
    bannerType = 'DOT';
    bannerImageSource = POPUP_DOTBALL;
    bannerBadgeBg = '#475569';
  } else {
    if (totalRunsScored === 0) {
      bannerType = 'DOT';
      bannerImageSource = POPUP_DOTBALL;
      bannerBadgeBg = '#475569';
    } else if (totalRunsScored === 1) {
      bannerType = 'ONE_RUN';
      bannerImageSource = POPUP_1RUN;
      bannerBadgeBg = '#0284c7';
    } else if (totalRunsScored === 2) {
      bannerType = 'TWO_RUNS';
      bannerImageSource = POPUP_2RUNS;
      bannerBadgeBg = '#0284c7';
    } else if (totalRunsScored === 3) {
      bannerType = 'THREE_RUNS';
      bannerImageSource = POPUP_3RUNS;
      bannerBadgeBg = '#0284c7';
    } else if (totalRunsScored === 4) {
      bannerType = 'FOUR';
      bannerImageSource = POPUP_4RUNS;
      bannerBadgeBg = '#059669';
    } else if (totalRunsScored === 6) {
      bannerType = 'SIX';
      bannerImageSource = POPUP_SIX;
      bannerBadgeBg = '#2563eb';
    } else {
      bannerType = 'MORE_RUNS';
      bannerImageSource = POPUP_1RUN;
      bannerBadgeBg = '#7c3aed';
    }
  }

  // Generate detailed professional breakdown of reasons and wagon wheel details
  let titleText = '';
  let subtitleText = '';
  let whyReason = '';
  let tipText = '';
  let iconEmoji = '🏏';

  if (bannerType === 'FOUR') {
    iconEmoji = '💥';
    titleText = 'Four Runs – BOUNDARY 4!';
    subtitleText = `Hit by ${batter} off ${bowler}`;
    whyReason = `Punched past ${sector} with immaculate timing! The ball raced across the outfield and crossed the boundary rope for 4 runs.`;
    tipText = "Tip: 4 runs credited to batter's score; boundary count updated.";
  } else if (bannerType === 'MORE_RUNS') {
    iconEmoji = '🏃';
    titleText = `${runs} Runs – ${runs} RUNS!`;
    subtitleText = `Brilliant running: ${batter} & ${nonStriker}`;
    whyReason = `Driven into the deep gap towards ${sector}. Incredible athletic running between the wickets to complete ${runs} runs off the delivery!`;
    tipText = `Tip: ${runs} runs scored off the bat; strike rotated to ${runs % 2 === 1 ? nonStriker : batter}.`;
  } else if (bannerType === 'SIX') {
    iconEmoji = '🚀';
    titleText = 'Six Runs – MAXIMUM 6!';
    subtitleText = `Huge hit by ${batter} off ${bowler}`;
    whyReason = `Massive strike! Smashed high and handsome over ${sector} deep into the stadium stands. 6 runs awarded without bouncing.`;
    tipText = "Tip: 6 runs credited to batter's score; maximum count incremented.";
  } else if (bannerType === 'RUN_OUT') {
    iconEmoji = '⚡';
    titleText = 'Run Out – RUN OUT!';
    subtitleText = `run out (${catcher || 'Fielder'})`;
    whyReason = `Why Out: Direct throw hit the stumps while ${batter} was stranded short of the popping crease. Decision confirmed out.`;
    tipText = "Tip: Run outs do not charge the bowler's official bowling analysis.";
  } else if (bannerType === 'STUMPED') {
    iconEmoji = '🧤';
    titleText = '🧤 Stumping – STUMPED!';
    subtitleText = `st †${catcher || 'Wicketkeeper'} b ${bowler}`;
    whyReason = `Why Out: Batter dragged foot out of crease while attacking. Wicketkeeper collected cleanly and whipped off the bails in a flash.`;
    tipText = "Tip: Stumping is credited as a bowler wicket and wicketkeeper dismissal.";
  } else if (bannerType === 'LBW') {
    iconEmoji = '🔥';
    titleText = '🔥 LBW Out – LBW!';
    subtitleText = `lbw b ${bowler}`;
    whyReason = `Why Out: Struck on the front pad in line with middle and off stumps. Ball pitched in line, impact in line, and would have crashed into the stumps. Plumb in front!`;
    tipText = "Tip: LBW wickets are credited to the bowler's official bowling figures.";
  } else if (bannerType === 'CAUGHT') {
    iconEmoji = '🤲';
    titleText = 'Caught Out – CAUGHT!';
    subtitleText = `c ${catcher || 'Fielder'} b ${bowler}`;
    whyReason = `Why Out: Aerial shot towards ${sector}. Fielder ${catcher || 'in deep'} judged the trajectory perfectly and took a clean catch.`;
    tipText = "Tip: Batter dismissed; wicket credited to bowler and catch to fielder.";
  } else if (bannerType === 'BOWLED') {
    iconEmoji = '🎯';
    titleText = 'Bowled Out – BOWLED!';
    subtitleText = `b ${bowler}`;
    whyReason = `Why Out: Clean bowled! Beat the defensive stroke and shattered the stumps, dislodging the bails.`;
    tipText = "Tip: Use 'Edit Ball' if the delivery was called a no-ball or decision was reversed.";
  } else if (bannerType === 'THREE_RUNS') {
    iconEmoji = '🏃';
    titleText = '🏃 Three Runs – 3 RUNS!';
    subtitleText = `Running between wickets by ${batter} & ${nonStriker}`;
    whyReason = `Pushed into the deep gap towards ${sector}. Superb running between the wickets by both batsmen to complete 3 runs safely.`;
    tipText = "Tip: 3 runs completed off the bat; strike rotates to the non-striker.";
  } else if (bannerType === 'TWO_RUNS') {
    iconEmoji = '⚡';
    titleText = '⚡ Two Runs – 2 RUNS!';
    subtitleText = `Double taken by ${batter} & ${nonStriker}`;
    whyReason = `Worked into the gap at ${sector}. Quick call and sharp turning at the crease allowed both batsmen to comfortably take 2 runs.`;
    tipText = "Tip: 2 runs scored off the bat; striker retains the strike.";
  } else if (bannerType === 'ONE_RUN') {
    iconEmoji = '🔄';
    titleText = '🔄 One Run – SINGLE!';
    subtitleText = `Strike rotated: ${batter} ➔ ${nonStriker}`;
    whyReason = `Tapped softly into ${sector} for a quick single. Good communication between wickets to rotate the strike safely.`;
    tipText = "Tip: 1 run scored off the bat; non-striker moves to the striker end.";
  } else if (bannerType === 'OVERTHROW') {
    iconEmoji = '⚡';
    titleText = `Overthrow – OVERTHROW! +${runs} RUNS`;
    const otFieldersList = Array.isArray(delivery.overthrowFielders) && delivery.overthrowFielders.length > 0
      ? delivery.overthrowFielders.join(', ')
      : (Array.isArray(delivery.overthrow_fielders) && delivery.overthrow_fielders.length > 0
        ? delivery.overthrow_fielders.join(', ')
        : (delivery.fielderName || delivery.fielder_name || catcher || 'Fielding Side'));
    subtitleText = `Conceded by throw: ${otFieldersList}`;
    whyReason = `Overthrow conceded by ${otFieldersList} towards ${sector}. Wayward throw missed stumps and backup fielder, allowing batters to complete +${runs} extra runs safely.`;
    tipText = 'Tip: Overthrow runs count towards team total and batter score (MCC Law 19.8).';
  } else if (bannerType === 'NO_BALL') {
    iconEmoji = '🚫';
    titleText = 'No Ball – FREE HIT!';
    subtitleText = `Bowled by ${bowler} (+1 Extra & Free Hit)`;
    whyReason = `Illegal delivery: Bowler overstepped the popping crease (front foot no-ball). 1 extra run added and next ball is a FREE HIT!`;
    tipText = "Tip: Batsman cannot be dismissed on a Free Hit except by run out.";
  } else if (bannerType === 'WIDE') {
    iconEmoji = '↔️';
    titleText = 'Wide Ball – WIDE! (+1 Extra)';
    subtitleText = `Bowled by ${bowler}`;
    whyReason = `Delivery passed outside the tramline marking beyond batter's reach. 1 extra run added and delivery must be re-bowled.`;
    tipText = "Tip: Wide deliveries do not count towards the 6 legal balls in the over.";
  } else if (bannerType === 'DEAD_BALL') {
    iconEmoji = '🛑';
    titleText = 'Dead Ball – MCC LAW 20';
    subtitleText = `Signaled by on-field umpire (${bowler} to ${batter})`;
    whyReason = `Play ceased immediately by the umpire (MCC Law 20). No runs can be scored, no wicket can fall, and the delivery does not count towards the over.`;
    tipText = "Tip: Delivery must be re-bowled; legal ball count and bowler analysis remain unchanged.";
  } else if (bannerType === 'DOT') {
    iconEmoji = '🛡️';
    titleText = 'Dot Ball – NO RUN (0)';
    subtitleText = `Faced by ${batter} from ${bowler}`;
    whyReason = `Solid defensive shot towards ${sector}. Fielded cleanly inside the circle with no run conceded. Excellent pressure ball!`;
    tipText = "Tip: Dot balls build pressure and lower the scoring run rate.";
  } else {
    iconEmoji = '🏏';
    titleText = `Delivery – +${runs} RUNS`;
    subtitleText = `Scored off ${bowler}`;
    whyReason = delivery.commentary || `Ball played towards ${sector} for ${runs} run(s).`;
    tipText = "Tip: Use 'Edit Ball' to retroactively modify runs, extras or wicket.";
  }

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
              EXACT 16:9 WIDESCREEN 210px HEIGHT BANNER (ZERO CROPPING / FULL VIEW)
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

            {/* Top Fade Gradient for controls */}
            <View style={styles.bannerTopFadeGradient} />

            {/* Dynamic Comic Ribbon Badge for More Runs (5, 7, 8, 9, 10, 11) */}
            {isMoreRuns && (
              <View style={styles.moreRunsComicBadge}>
                <Text style={styles.moreRunsNumber}>{runs}</Text>
                <Text style={styles.moreRunsLabel}>RUNS!</Text>
              </View>
            )}

            {/* Top Left Floating Pill: Ball X.Y */}
            <View style={[styles.headerPill, { backgroundColor: bannerBadgeBg }]}>
              <Text style={styles.headerPillText}>{bannerBadgeText}</Text>
            </View>

            {/* Top Right Close Button */}
            <TouchableOpacity
              style={styles.closeCircleBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeCircleBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* ═════════════════════════════════════════════════════════════════════
              CARD CONTENT BODY (PROFESSIONAL DETAILS: STRIKER, NON-STRIKER, BOWLER, WAGON WHEEL)
             ═════════════════════════════════════════════════════════════════════ */}
          <ScrollView style={styles.contentBody} bounces={false}>
            {/* ═════════════════════════════════════════════════════════════════════
                OFFICIAL MATCH DELIVERY HUD CARD (Directly below image)
                1. Ball Details: Over & Ball Number, Total Runs – 3
                2. Batting Details: Striker Name, Non-Striker Name
                3. Bowling Details: Bowler Name, Fielder / Wagon Wheel Sector
                4. Match Details: Current Score, Batting Team
               ═════════════════════════════════════════════════════════════════════ */}
            <View style={styles.hudCardContainer}>
              <View style={styles.hudCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.hudLivePulse} />
                  <Text style={styles.hudCardHeaderTitle}>MATCH DELIVERY HUD BREAKDOWN</Text>
                </View>
                <View style={styles.hudBallBadge}>
                  <Text style={styles.hudBallBadgeText}>BALL {ballText}</Text>
                </View>
              </View>

              <View style={styles.hudGrid}>
                {/* 1. BALL DETAILS */}
                <View style={styles.hudGridItem}>
                  <View style={styles.hudItemHeader}>
                    <Text style={styles.hudItemIcon}>📊</Text>
                    <Text style={styles.hudItemTitle}>1. BALL DETAILS</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Over & Ball:</Text>
                    <Text style={styles.hudValueBold}>Over {ballText}</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Total Runs:</Text>
                    <View style={styles.hudRunsBadge}>
                      <Text style={styles.hudRunsBadgeText}>Total Runs – {totalRunsScored}</Text>
                    </View>
                  </View>
                </View>

                {/* 2. BATTING DETAILS */}
                <View style={styles.hudGridItem}>
                  <View style={styles.hudItemHeader}>
                    <Text style={styles.hudItemIcon}>🏏</Text>
                    <Text style={styles.hudItemTitle}>2. BATTING DETAILS</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Striker:</Text>
                    <Text style={styles.hudValueStriker} numberOfLines={1}>★ {batter}</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Non-Striker:</Text>
                    <Text style={styles.hudValue} numberOfLines={1}>{nonStriker}</Text>
                  </View>
                </View>

                {/* 3. BOWLING DETAILS */}
                <View style={styles.hudGridItem}>
                  <View style={styles.hudItemHeader}>
                    <Text style={styles.hudItemIcon}>🎳</Text>
                    <Text style={styles.hudItemTitle}>3. BOWLING DETAILS</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Bowler:</Text>
                    <Text style={styles.hudValueBowler} numberOfLines={1}>🎳 {bowler}</Text>
                  </View>
                </View>

                {/* 4. MATCH DETAILS */}
                <View style={styles.hudGridItem}>
                  <View style={styles.hudItemHeader}>
                    <Text style={styles.hudItemIcon}>🏆</Text>
                    <Text style={styles.hudItemTitle}>4. MATCH DETAILS</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Score:</Text>
                    <Text style={styles.hudValueScore}>{currentScore || 'Live Score'}</Text>
                  </View>
                  <View style={styles.hudRow}>
                    <Text style={styles.hudLabel}>Team:</Text>
                    <Text style={styles.hudValue} numberOfLines={1}>{battingTeamName || 'Batting Team'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 1. Headline Row */}
            <View style={styles.headlineRow}>
              <View style={styles.iconCircleBadge}>
                <Text style={{ fontSize: 26 }}>{iconEmoji}</Text>
              </View>
              <View style={styles.headlineTextCol}>
                <Text style={styles.mainTitle}>{titleText}</Text>
                <Text style={styles.subTitle}>{subtitleText}</Text>
              </View>
            </View>

            {/* 2. Wagon Wheel Sector / Shot Direction Badge (ONLY for 4s and 6s) */}
            {(isFour || isSix) && (
              <View style={styles.wagonWheelRow}>
                <View style={styles.wagonWheelPill}>
                  <Text style={styles.wagonWheelPillIcon}>🎯</Text>
                  <Text style={styles.wagonWheelPillLabel}>Wagon Wheel / Direction:</Text>
                  <Text style={styles.wagonWheelPillValue}>{sector}</Text>
                </View>
              </View>
            )}

            {/* 3. Dual Action Buttons: '✏️ Edit Ball' & '✓ OK' */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editBallBtn}
                onPress={() => {
                  onClose();
                  onEdit(delivery);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.editBallBtnText}>✏️ Edit Ball {ballText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.okBtnText}>✓ OK</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const cardMaxWidth = Math.min(width - 24, 580);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12
  },
  cardContainer: {
    width: '100%',
    maxWidth: cardMaxWidth,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)'
      },
      default: {
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20
      }
    })
  },

  // COMPACT 16:9 WIDESCREEN 165px HEIGHT BANNER
  uniformBannerWrap: {
    width: '100%',
    height: 165,
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
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    zIndex: 99,
    elevation: 6
  },
  closeCircleBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900'
  },

  // Dynamic Comic Badge for More Runs (5, 7, 8, 9, 10, 11)
  moreRunsComicBadge: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#ffffff',
    borderColor: '#f59e0b',
    borderWidth: 3.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)'
      },
      default: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 6
      }
    }),
    transform: [{ rotate: '-3deg' }]
  },
  moreRunsNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: -1,
    marginRight: 6
  },
  moreRunsLabel: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5
  },

  // Content Body
  contentBody: {
    padding: 12,
    maxHeight: 380
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  iconCircleBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.3,
    marginBottom: 2
  },
  subTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b'
  },

  // Wagon Wheel Direction Pill
  wagonWheelRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  wagonWheelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6
  },
  wagonWheelPillIcon: {
    fontSize: 13
  },
  wagonWheelPillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857'
  },
  wagonWheelPillValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#065f46'
  },

  // Details Reason Box
  reasonCardBox: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    marginBottom: 10
  },
  reasonCardText: {
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 18,
    fontWeight: '500'
  },

  // Complete Player Strip Row (Striker, Non-Striker, Bowler, Fielder)
  playerStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 9,
    marginBottom: 10
  },
  playerStripCol: {
    flex: 1
  },
  playerStripLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 1
  },
  playerStripValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  playerStripDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 6
  },

  // Tip Box
  tipBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14
  },
  tipIcon: {
    fontSize: 14
  },
  tipText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15
  },

  // Action Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },
  editBallBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1.5,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBallBtnText: {
    color: '#0284c7',
    fontSize: 12.5,
    fontWeight: '700'
  },
  okBtn: {
    flex: 1.2,
    paddingVertical: 11,
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
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },

  // OFFICIAL MATCH DELIVERY HUD STYLES (YELLOW & WHITE CLEAN THEME)
  hudCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#f59e0b',
    padding: 10,
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '0 2px 10px rgba(245, 158, 11, 0.15)' },
      default: { elevation: 3 }
    })
  },
  hudCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
    marginBottom: 8
  },
  hudLivePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a'
  },
  hudCardHeaderTitle: {
    color: '#b45309',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  hudBallBadge: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  hudBallBadgeText: {
    color: '#92400e',
    fontSize: 10.5,
    fontWeight: '900'
  },
  hudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  hudGridItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fffdf5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fef08a',
    padding: 8
  },
  hudItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fef08a'
  },
  hudItemIcon: {
    fontSize: 12
  },
  hudItemTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#b45309',
    letterSpacing: 0.4
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3
  },
  hudLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600'
  },
  hudValue: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: '700',
    maxWidth: '65%'
  },
  hudValueBold: {
    fontSize: 11.5,
    color: '#0f172a',
    fontWeight: '900'
  },
  hudValueStriker: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '800',
    maxWidth: '65%'
  },
  hudValueBowler: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '800',
    maxWidth: '65%'
  },
  hudValueScore: {
    fontSize: 11.5,
    color: '#16a34a',
    fontWeight: '900'
  },
  hudRunsBadge: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  hudRunsBadgeText: {
    color: '#b45309',
    fontSize: 10.5,
    fontWeight: '900'
  }
});

export default DeliveryInspectionModal;
