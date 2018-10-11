enum breakpoints {
  Tablet = 720,
  Desktop = 900,
  Large = 1160,
  Max = 1440
}

export const theme = {
  breakpoints: {
    ...breakpoints
  },
  colors: {
    headerBg: "#149ecb",
    waterBlue: "#1976d2"
  },
  maxWidth: 1440
}
