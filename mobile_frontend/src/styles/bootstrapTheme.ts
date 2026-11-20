/**
 * src/styles/bootstrapTheme.ts
 *
 * Direct React Native port of Bootstrap v5.0.2 from:
 * mobile_frontend/bootstrap-5.0.2-dist/bootstrap-5.0.2-dist/css/bootstrap.css
 *
 * Provides exact CSS variables, button styles, card structures, badges,
 * nav-pills, tables, alerts, and utility classes for mobile screens.
 */

import { StyleSheet } from 'react-native';

// ─── 1. BOOTSTRAP 5 ROOT CSS VARIABLES (:root in bootstrap.css) ──────────────
export const bsColors = {
  // Brand colors (--bs-*)
  blue: '#0d6efd',
  indigo: '#6610f2',
  purple: '#6f42c1',
  pink: '#d63384',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#198754',
  teal: '#20c997',
  cyan: '#0dcaf0',
  white: '#ffffff',
  gray: '#6c757d',
  grayDark: '#343a40',

  // Semantic color aliases
  primary: '#0d6efd',
  secondary: '#6c757d',
  success: '#198754',
  info: '#0dcaf0',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#212529',

  // Subtle background tints
  primaryBgSubtle: '#cfe2ff',
  secondaryBgSubtle: '#e2e3e5',
  successBgSubtle: '#d1e7dd',
  infoBgSubtle: '#cff4fc',
  warningBgSubtle: '#fff3cd',
  dangerBgSubtle: '#f8d7da',
  lightBgSubtle: '#fcfcfd',
  darkBgSubtle: '#ced4da',

  // Subtle border colors
  primaryBorderSubtle: '#9ec5fe',
  secondaryBorderSubtle: '#c4c8cb',
  successBorderSubtle: '#a3cfbb',
  infoBorderSubtle: '#9eeaf9',
  warningBorderSubtle: '#ffe69c',
  dangerBorderSubtle: '#f1aeb5',

  // Surface & Borders
  border: '#dee2e6',
  borderDark: 'rgba(0, 0, 0, 0.125)',
  bodyBg: '#f8f9fa',
  bodyColor: '#212529',
  textMuted: '#6c757d',
  cardBg: '#ffffff',
  cardHeaderBg: 'rgba(0, 0, 0, 0.03)',
  cardFooterBg: 'rgba(0, 0, 0, 0.03)',
  tableStripedBg: 'rgba(0, 0, 0, 0.025)',
};

// ─── 2. BOOTSTRAP 5 CARDS (.card in bootstrap.css:4250) ───────────────────────
export const bsCards = StyleSheet.create({
  card: {
    backgroundColor: bsColors.cardBg,
    borderRadius: 6, // 0.25rem = 4px, standard 6px for mobile
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.125)',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.125)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: bsColors.dark,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: bsColors.dark,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: bsColors.textMuted,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: bsColors.dark,
    lineHeight: 20,
  },
  cardFooter: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.125)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

// ─── 3. BOOTSTRAP 5 BUTTONS (.btn in bootstrap.css:2907) ─────────────────────
export const bsButtons = StyleSheet.create({
  btn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 4, // 0.25rem
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnSm: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3.2,
  },
  btnLg: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4.8,
  },

  // Solid Color Buttons
  btnPrimary: {
    backgroundColor: bsColors.primary,
    borderColor: bsColors.primary,
  },
  btnSecondary: {
    backgroundColor: bsColors.secondary,
    borderColor: bsColors.secondary,
  },
  btnSuccess: {
    backgroundColor: bsColors.success,
    borderColor: bsColors.success,
  },
  btnDanger: {
    backgroundColor: bsColors.danger,
    borderColor: bsColors.danger,
  },
  btnWarning: {
    backgroundColor: bsColors.warning,
    borderColor: bsColors.warning,
  },
  btnInfo: {
    backgroundColor: bsColors.info,
    borderColor: bsColors.info,
  },
  btnLight: {
    backgroundColor: bsColors.light,
    borderColor: bsColors.light,
  },
  btnDark: {
    backgroundColor: bsColors.dark,
    borderColor: bsColors.dark,
  },

  // Outline Buttons (.btn-outline-*)
  btnOutlinePrimary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.primary,
  },
  btnOutlineSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.secondary,
  },
  btnOutlineSuccess: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.success,
  },
  btnOutlineDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.danger,
  },
  btnOutlineWarning: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.warning,
  },
  btnOutlineInfo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.info,
  },
  btnOutlineLight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  btnOutlineDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: bsColors.dark,
  },

  // Button Labels
  btnTextWhite: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextDark: {
    color: bsColors.dark,
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextPrimary: {
    color: bsColors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextSecondary: {
    color: bsColors.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextSuccess: {
    color: bsColors.success,
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextDanger: {
    color: bsColors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
});

// ─── 4. BOOTSTRAP 5 BADGES (.badge in bootstrap.css:4629) ────────────────────
export const bsBadges = StyleSheet.create({
  badge: {
    paddingVertical: 3.5,
    paddingHorizontal: 7.5,
    borderRadius: 4, // 0.25rem
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingVertical: 3.5,
    paddingHorizontal: 10,
    borderRadius: 50, // rounded-pill in bootstrap
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Badge Colors
  bgPrimary: {
    backgroundColor: bsColors.primary,
  },
  bgSecondary: {
    backgroundColor: bsColors.secondary,
  },
  bgSuccess: {
    backgroundColor: bsColors.success,
  },
  bgDanger: {
    backgroundColor: bsColors.danger,
  },
  bgWarning: {
    backgroundColor: bsColors.warning,
  },
  bgInfo: {
    backgroundColor: bsColors.info,
  },
  bgDark: {
    backgroundColor: bsColors.dark,
  },
  bgLight: {
    backgroundColor: bsColors.light,
    borderWidth: 1,
    borderColor: bsColors.border,
  },

  // Subtle Badges
  bgPrimarySubtle: {
    backgroundColor: bsColors.primaryBgSubtle,
    borderWidth: 1,
    borderColor: bsColors.primaryBorderSubtle,
  },
  bgSuccessSubtle: {
    backgroundColor: bsColors.successBgSubtle,
    borderWidth: 1,
    borderColor: bsColors.successBorderSubtle,
  },
  bgDangerSubtle: {
    backgroundColor: bsColors.dangerBgSubtle,
    borderWidth: 1,
    borderColor: bsColors.dangerBorderSubtle,
  },
  bgWarningSubtle: {
    backgroundColor: bsColors.warningBgSubtle,
    borderWidth: 1,
    borderColor: bsColors.warningBorderSubtle,
  },
  bgInfoSubtle: {
    backgroundColor: bsColors.infoBgSubtle,
    borderWidth: 1,
    borderColor: bsColors.infoBorderSubtle,
  },

  // Text inside badges
  textWhite: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  textDark: {
    color: bsColors.dark,
    fontSize: 11,
    fontWeight: '700',
  },
  textPrimary: {
    color: bsColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  textSuccess: {
    color: bsColors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  textDanger: {
    color: bsColors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  textWarning: {
    color: '#856404',
    fontSize: 11,
    fontWeight: '700',
  },
});

// ─── 5. BOOTSTRAP 5 NAV PILLS & TABS (.nav-pills in bootstrap.css:3898) ───────
export const bsNav = StyleSheet.create({
  navPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  navLink: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLinkActive: {
    backgroundColor: bsColors.primary,
    borderColor: bsColors.primary,
  },
  navLinkOutline: {
    borderColor: bsColors.border,
    backgroundColor: '#ffffff',
  },
  navLinkText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: bsColors.primary,
  },
  navLinkTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  navLinkTextMuted: {
    color: bsColors.secondary,
    fontWeight: '500',
  },
});

// ─── 6. BOOTSTRAP 5 TABLES (.table in bootstrap.css:2622) ─────────────────────
export const bsTable = StyleSheet.create({
  table: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: bsColors.border,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderColor: bsColors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerCell: {
    fontSize: 11.5,
    fontWeight: '700',
    color: bsColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: bsColors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  rowStriped: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  cellText: {
    fontSize: 12.5,
    color: bsColors.dark,
    fontWeight: '500',
  },
});

// ─── 7. BOOTSTRAP 5 ALERTS (.alert in bootstrap.css:4526) ─────────────────────
export const bsAlert = StyleSheet.create({
  alert: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertPrimary: {
    backgroundColor: bsColors.primaryBgSubtle,
    borderColor: bsColors.primaryBorderSubtle,
  },
  alertSuccess: {
    backgroundColor: bsColors.successBgSubtle,
    borderColor: bsColors.successBorderSubtle,
  },
  alertWarning: {
    backgroundColor: bsColors.warningBgSubtle,
    borderColor: bsColors.warningBorderSubtle,
  },
  alertDanger: {
    backgroundColor: bsColors.dangerBgSubtle,
    borderColor: bsColors.dangerBorderSubtle,
  },
  alertInfo: {
    backgroundColor: bsColors.infoBgSubtle,
    borderColor: bsColors.infoBorderSubtle,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '500',
    color: bsColors.dark,
  },
});

// ─── 8. BOOTSTRAP 5 TYPOGRAPHY (.h1-.h6, text-* in bootstrap.css) ────────────
export const bsTypography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: bsColors.dark,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: bsColors.dark,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    color: bsColors.dark,
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: bsColors.dark,
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontWeight: '600',
    color: bsColors.dark,
    lineHeight: 22,
  },
  h6: {
    fontSize: 14,
    fontWeight: '600',
    color: bsColors.dark,
    lineHeight: 20,
  },
  lead: {
    fontSize: 16,
    fontWeight: '300',
    color: bsColors.textMuted,
    lineHeight: 24,
  },
  textMuted: {
    color: bsColors.textMuted,
  },
  textPrimary: {
    color: bsColors.primary,
  },
  textSuccess: {
    color: bsColors.success,
  },
  textDanger: {
    color: bsColors.danger,
  },
  textWarning: {
    color: '#856404',
  },
});
