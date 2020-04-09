import styled from "styled"

const defaultSize = 30
const defaultBorderWidth = 5
const getBorderWidth = (size: number, borderSize: number) => size + Math.round(borderSize * Math.cos(Math.PI / 4) * 2)

interface ChartArrowProps {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  size?: number
  top?: string
  bottom?: string
  left?: string
  right?: string
}

const ChartArrow = styled("div")`
  position: absolute;
  z-index: 1;

  &:after,
  &:before {
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-width: ${({ size }: ChartArrowProps) =>
      size ? `${size}px` : `${defaultSize}px`};
  }

  &:before {
    border-width: ${({ size, borderWidth }: ChartArrowProps) =>
      size && borderWidth
        ? `${getBorderWidth(size, borderWidth)}px`
        : `${getBorderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      border-width: 10px;
    }
    &:before {
      border-width: ${getBorderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowLeft = styled(ChartArrow)`
  left: 0;
  top: ${({ top }: ChartArrowProps) => (top ? top : "unset")};
  bottom: ${({ bottom }: ChartArrowProps) => (bottom ? bottom : "unset")};

  &:after,
  &:before {
    right: 100%;
    top: 50%;
  }

  &:after {
    border-right-color: ${({ backgroundColor }: ChartArrowProps) =>
      backgroundColor ? backgroundColor : "transparent"};
    margin-top: ${({ size }: ChartArrowProps) =>
      size ? `-${size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-right-color: ${({ borderColor }: ChartArrowProps) =>
      borderColor ? borderColor : "#fff"};
    margin-top: ${({ size, borderWidth }: ChartArrowProps) =>
      size && borderWidth
        ? `-${getBorderWidth(size, borderWidth)}px`
        : `-${getBorderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-top: -10px;
    }
    &:before {
      margin-top: -${getBorderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowRight = styled(ChartArrow)`
  right: 0;
  top: ${({ top }: ChartArrowProps) => (top ? top : "unset")};
  bottom: ${({ bottom }: ChartArrowProps) => (bottom ? bottom : "unset")};

  &:after,
  &:before {
    left: 100%;
    top: 50%;
  }

  &:after {
    border-left-color: ${({ backgroundColor }: ChartArrowProps) =>
      backgroundColor ? backgroundColor : "transparent"};
    margin-top: ${({ size }: ChartArrowProps) =>
      size ? `-${size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-left-color: ${({ borderColor }: ChartArrowProps) =>
      borderColor ? borderColor : "#fff"};
    margin-top: ${({ size, borderWidth }: ChartArrowProps) =>
      size && borderWidth
        ? `-${getBorderWidth(size, borderWidth)}px`
        : `-${getBorderWidth(defaultSize, defaultBorderWidth)}px`};
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-top: -10px;
    }
    &:before {
      margin-top: -${getBorderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowTop = styled(ChartArrow)`
  top: 0;
  left: ${({ left }: ChartArrowProps) => (left ? left : "unset")};
  right: ${({ right }: ChartArrowProps) => (right ? right : "unset")};

  &:after,
  &:before {
    bottom: 100%;
    left: 50%;
  }

  &:after {
    border-bottom-color: ${({ backgroundColor }: ChartArrowProps) =>
      backgroundColor ? backgroundColor : "transparent"};
    margin-left: ${({ size }: ChartArrowProps) =>
      size ? `-${size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-bottom-color: ${({ borderColor }: ChartArrowProps) =>
      borderColor ? borderColor : "#fff"};
    margin-left: ${({ size, borderWidth }: ChartArrowProps) =>
      size && borderWidth
        ? `-${getBorderWidth(size, borderWidth)}px`
        : `-${getBorderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-left: -10px;
    }
    &:before {
      margin-left: -${getBorderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowBottom = styled(ChartArrow)`
  bottom: 0;
  left: ${({ left }: ChartArrowProps) => (left ? left : "unset")};
  right: ${({ right }: ChartArrowProps) => (right ? right : "unset")};

  &:after,
  &:before {
    top: 100%;
    left: 50%;
  }

  &:after {
    border-top-color: ${({ backgroundColor }: ChartArrowProps) =>
      backgroundColor ? backgroundColor : "transparent"};
    margin-left: ${({ size }: ChartArrowProps) =>
      size ? `-${size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-top-color: ${({ borderColor }: ChartArrowProps) =>
      borderColor ? borderColor : "#fff"};
    margin-left: ${({ borderWidth, size }: ChartArrowProps) =>
      size && borderWidth
        ? `-${getBorderWidth(size, borderWidth)}px`
        : `-${getBorderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-left: -10px;
    }
    &:before {
      margin-left: -${getBorderWidth(10, 5)}px;
    }
  }
`
