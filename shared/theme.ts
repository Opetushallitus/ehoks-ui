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
  ready: "#5BAC13"
}

export const theme = {
  breakpoints: {
    ...breakpoints
  },
  colors: {
    ...themeColors,
    header: {
      background: "#149ecb"
    },
    buttons: {
      background: "#0076d9",
      color: "#fff"
    },
    modalDialog: {
      dot: "#A5ACB0",
      dotActive: "#fff"
    },
    links: {
      active: "#0076d9",
      disabled: themeColors.pinkishGrey
    },
    notification: {
      alertBorder: themeColors.yellowOchre,
      errorBorder: themeColors.brick,
      questionBorder: themeColors.waterBlue,
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
  maxWidth: 1440
}
