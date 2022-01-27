import SingleValue from 'react-select/lib/components/SingleValue'

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
export const colorDictionary = {
  // remove color dictionary and just use the below colour library
  blackStormy: '#35495D',
  blueDeepSea: '#4C68C1',
  blueDeepSeaLight: '#F1F3FA',
  blueBabyBaby: '#5E93ED',
  purpleDrafty: '#8049B7',
  orangeAmber: '#F1B162',
  redDanger: '#D53F3F',
  redDangerDark: '#994040',
  greenPeaPea: '#49B78D',
  greenPeaPeaDark: '#409977',
  blueCrystal: '#4A8AD7',
  yellowFocus: '#EDC55E',
  white: '#FFFFFF',
  black: '#000000',
  blueHover: '#F2F6FE',
  greyBlackMetal: '#373D3F',
  greyRaven: '#555F61',
  greyDarkSteel: '#707C80',
  greySteel: '#A7B0B2',
  greyGrey: '#C1C7C9',
  greySmoky: '#DADEDF',
  greyPearl: '#F2F3F4',
  nightshadeDark: '#42506B',
  nightshadeLight: '#485F88',
  darkSteel: '#707C80',
  lightGrey: '#F9F9F9',
  mercury: '#E5E5E5',
  silverSand: '#C1C7C9',
  swansDown: '#D3EEE4',
  fountainBlue: '#4CC1BA',
  ronchi: '#EDC55E'
}

export const gradients = {
  gradientNightshade:
    'background: linear-gradient(180deg, #42506B 0%, #485F88 100%)',
  gradientSkyDark:
    'background: linear-gradient(180deg, #3C55A3 0%, #4C68C1 100%)', // replace and delete
  gradientSkyLight:
    'background: linear-gradient(180deg, #6291CD 0%, #AACAF3 100%)', // replace and delete
  gradientBabyShade:
    'background: linear-gradient(180deg, #477cd7 0%, #5c91eb 100%);', // replace and delete
  gradientGreyShade:
    'background: linear-gradient(180deg, #FFFFFF 0%, #F2F3F4 100%);'
}

export const shadows = {
  mistyShadow: 'box-shadow: 0px 2px 6px rgba(53, 67, 93, 0.32)', // rename lightShadow - dropdowns selects
  thickShadow: 'box-shadow: 0px 2px 8px rgba(53, 67, 93, 0.54)' // rename heavyShadow - models
}

export const colors = {
  // Pallete
  primary: '#4972bb', // indigo
  secondary: '#4A8AD7', // blue
  tertiary: '#cccfd0', // grey

  purple: '#8049B7', // in progress
  orange: '#F1B162', // ready for review
  red: '#d53f3f', // requires updates
  green: '#49b78d', // registered
  blue: '#4A8AD7', // certified
  teal: '#4CC1BA', // charts

  // Status
  success: '#49b78d', // rename to positive - green buttons, lighten to make light green backgrounds
  successHover: '#409977', // remove and use darken of success/positive colour for hover states
  warning: '#f1b162', // rename to neutral
  error: '#d53f3f', // rename to negative -  no buttons, lighten to make light red backgrounds
  errorHover: '#994040', // remove and use darken of error colour for hover states
  focus: '#edc55e', // focus state for buttons, forms, elements etc. (keyboard navigation)

  // Monochrome
  white: '#ffffff',
  grey200: '#f8f8f8', // app background
  grey300: '#f1f2f3', // hover state, light background
  grey400: '#dee2e4', // dividers
  grey500: '#cccfd0', // disabled state, borders
  grey600: '#909397', // placeholder copy
  grey700: '#595c5f', // supporting copy
  grey800: '#1e2326', // copy

  // Opacity
  opacity24: 'rgba(41, 47, 51, 0.24)',
  opacity54: 'rgba(41, 47, 51, 0.54)', // model backdrop

  // Alternative defintions
  copy: '#1e2326', // grey800 rename to text
  secdondaryCopy: '#1e2326', // grey800 rename to secondarytText
  placeholder: '#909397', // grey600 rename to placeholderText
  background: '#f1f2f3', // grey300
  disabled: '#cccfd0', // grey500

  // primary: colorDictionary.blueDeepSea,
  // secondary: colorDictionary.blueBabyBaby,
  // tertiary: colorDictionary.blueDeepSea,
  // error: colorDictionary.redDanger,
  // errorHover: colorDictionary.redDangerDark,
  // warning: colorDictionary.orangeAmber,
  // copy: colorDictionary.blackStormy,
  // placeholder: colorDictionary.greyDarkSteel,
  // background: colorDictionary.greyPearl,
  // disabled: colorDictionary.greyGrey,
  // success: colorDictionary.greenPeaPea,
  // successHover: colorDictionary.greenPeaPeaDark,
  // white: colorDictionary.white,
  // black: colorDictionary.black,
  // focus: colorDictionary.yellowFocus,

  // FOR ALL THE BELOW FIND AND REPLACE WITH ABOVE COLOURS

  // Exceptions - Try to use one of the above before creating exceptions
  chartAreaGradientStart: colorDictionary.greySmoky,
  chartAreaGradientEnd: colorDictionary.blueHover,
  dropdownHover: colorDictionary.blueHover,
  loadingImage: colorDictionary.blueHover,
  menuBackground: colorDictionary.blackStormy,
  gradientDark: colorDictionary.nightshadeDark,
  gradientLight: colorDictionary.nightshadeLight,
  secondaryLabel: colorDictionary.darkSteel,
  previewBackground: colorDictionary.greyBlackMetal,
  smallButtonFocus: colorDictionary.mercury,
  dateDisabled: colorDictionary.greySteel,

  // Grey Scrollbar
  scrollBarGrey: colorDictionary.greySteel,
  lightScrollBarGrey: colorDictionary.greySmoky,

  // Dividers
  dividerLight: colorDictionary.greyPearl,
  dividerDark: colorDictionary.greySmoky,

  // Light Grey background
  lightGreyBackground: colorDictionary.lightGrey,

  // Deep sea light background
  blueDeepSeaLight: colorDictionary.blueDeepSeaLight,

  // Colors for applicatin statuses
  inProgress: colorDictionary.purpleDrafty,
  readyForReview: colorDictionary.orangeAmber,
  sentForUpdate: colorDictionary.redDanger,
  waitingForApproval: colorDictionary.greySteel,
  waitingForExternalValidation: colorDictionary.greyRaven,
  readyToPrint: colorDictionary.greenPeaPea,

  // Tri Line chart lines
  silverSand: colorDictionary.silverSand,
  swansDown: colorDictionary.swansDown,
  fountainBlue: colorDictionary.fountainBlue,
  ronchi: colorDictionary.ronchi
}
