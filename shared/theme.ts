export enum breakpoints {
  SmallTablet = 600,
  Tablet = 720,
  Desktop = 900,
  Large = 1160,
  Max = 1440
}

const themeColors = {
  amethyst: "#9c56b8",
  battleshipGrey: "#6e6e7e",
  beige: "#f1f8e9",
  black: "#282828",
  brick: "#c62828",
  darkGrey: "#313334",
  duckEggBlue: "#ecf3fc",
  flatBlue: "#316fa0",
  footerBg: "#f8f8f8",
  greyishBrown: "#4a4a4a",
  midGreen: "#43a047",
  pinkishGrey: "#cecece",
  pumpkin: "#eb6f02",
  yellowOchre: "#de9a06",
  waterBlue: "#1976d2",
  planned: "#FF5000",
  scheduled: "#FFCC33",
  ready: "#5BAC13",
  text: "#000",
  green900: "#254905",
  green700: "#3A7A10",
  green300: "#9CFF5A"
}

const fontFamily = '"Source Sans Pro", sans-serif;'
const fontBase = `
  font-family: ${fontFamily};
  line-height: 1.5;
  font-style: normal;
  text-rendering: optimizelegibility;
  text-size-adjust: 100%;
`
const fontSizes = {
  base: "16px",
  lead: "20px",
  subHeading: "20px",
  heading1: "30px",
  heading2: "20px",
  heading3: "20px",
  heading4: "16px"
}
const fontWeight = {
  base: "400",
  lead: "400",
  heading1: "400",
  heading2: "400",
  heading3: "600",
  heading4: "700",
  subHeading: "300"
}
const typography = {
  body: `
    ${fontBase}
    font-size: ${fontSizes.base};
    font-weight: ${fontWeight.base};
  `,
  lead: `
    ${fontBase}
    font-size: ${fontSizes.lead};
    font-weight: ${fontWeight.lead};
  `,
  heading1: `
    ${fontBase}
    font-size: ${fontSizes.heading1};
    font-weight: ${fontWeight.heading1};
  `,
  heading2: `
    ${fontBase}
    font-size: ${fontSizes.heading2};
    font-weight: ${fontWeight.heading2};
  `,
  heading3: `
    ${fontBase}
    font-size: ${fontSizes.heading3};
    font-weight: ${fontWeight.heading3};
  `,
  heading4: `
    ${fontBase}
    font-size: ${fontSizes.heading4};
    font-weight: ${fontWeight.heading4};
  `,
  subHeading: `
    ${fontBase}
    font-size: ${fontSizes.subHeading};
    font-weight: ${fontWeight.subHeading};
  `
}

export const theme = {
  breakpoints,
  colors: {
    ...themeColors,
    header: {
      background: "#3A7A10"
    },
    buttons: {
      background: "#3A7A10",
      cancelBackground: themeColors.greyishBrown,
      color: "#fff"
    },
    modalDialog: {
      dot: "#A5ACB0",
      dotActive: "#fff"
    },
    links: {
      active: "#3A7A10",
      disabled: "#B2B2B2"
    },
    notification: {
      alertBorder: themeColors.yellowOchre,
      errorBorder: themeColors.brick,
      questionBorder: themeColors.green700,
      successBorder: themeColors.midGreen,
      warningBorder: themeColors.yellowOchre,
      alertBg: "rgba(247, 180, 34, 0.05)",
      errorBg: "rgba(198, 40, 40, 0.05)",
      questionBg: "rgba(0, 153, 250, 0.1)",
      successBg: "rgba(86, 189, 91, 0.05)",
      warningBg: "rgba(247, 180, 34, 0.05)"
    },
    table: {
      cellBorder: "#000"
    }
  },
  typography,
  maxWidth: 1440,
  spacing: {
    xs: "6px",
    s: "10px",
    m: "15px",
    l: "20px",
    xl: "40px",
    xxl: "70px"
  }
}

export type TypeOfTheme = typeof theme
export type ColorType = keyof typeof theme.colors
