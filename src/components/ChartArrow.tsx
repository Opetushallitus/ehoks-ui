import styled from "styled"

const defaultSize = 30
const defaultBorderWidth = 5
const borderWidth = (size: number, borderSize: number) => {
  return size + Math.round(borderSize * Math.cos(Math.PI / 4) * 2)
}

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
    border-width: ${(props: ChartArrowProps) =>
      props.size ? `${props.size}px` : `${defaultSize}px`};
  }

  &:before {
    border-width: ${(props: ChartArrowProps) =>
      props.borderWidth
        ? `${borderWidth(props.size, props.borderWidth)}px`
        : `${borderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      border-width: 10px;
    }
    &:before {
      border-width: ${borderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowLeft = styled(ChartArrow)`
  left: 0;
  top: ${(props: ChartArrowProps) => (props.top ? props.top : "unset")};
  bottom: ${(props: ChartArrowProps) =>
    props.bottom ? props.bottom : "unset"};

  &:after,
  &:before {
    right: 100%;
    top: 50%;
  }

  &:after {
    border-right-color: ${(props: ChartArrowProps) =>
      props.backgroundColor ? props.backgroundColor : "transparent"};
    margin-top: ${(props: ChartArrowProps) =>
      props.size ? `-${props.size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-right-color: ${(props: ChartArrowProps) =>
      props.borderColor ? props.borderColor : "#fff"};
    margin-top: ${(props: ChartArrowProps) =>
      props.borderWidth
        ? `-${borderWidth(props.size, props.borderWidth)}px`
        : `-${borderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-top: -10px;
    }
    &:before {
      margin-top: -${borderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowRight = styled(ChartArrow)`
  right: 0;
  top: ${(props: ChartArrowProps) => (props.top ? props.top : "unset")};
  bottom: ${(props: ChartArrowProps) =>
    props.bottom ? props.bottom : "unset"};

  &:after,
  &:before {
    left: 100%;
    top: 50%;
  }

  &:after {
    border-left-color: ${(props: ChartArrowProps) =>
      props.backgroundColor ? props.backgroundColor : "transparent"};
    margin-top: ${(props: ChartArrowProps) =>
      props.size ? `-${props.size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-left-color: ${(props: ChartArrowProps) =>
      props.borderColor ? props.borderColor : "#fff"};
    margin-top: ${(props: ChartArrowProps) =>
      props.borderWidth
        ? `-${borderWidth(props.size, props.borderWidth)}px`
        : `-${borderWidth(defaultSize, defaultBorderWidth)}px`};
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-top: -10px;
    }
    &:before {
      margin-top: -${borderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowTop = styled(ChartArrow)`
  top: 0;
  left: ${(props: ChartArrowProps) => (props.left ? props.left : "unset")};
  right: ${(props: ChartArrowProps) => (props.right ? props.right : "unset")};

  &:after,
  &:before {
    bottom: 100%;
    left: 50%;
  }

  &:after {
    border-bottom-color: ${(props: ChartArrowProps) =>
      props.backgroundColor ? props.backgroundColor : "transparent"};
    margin-left: ${(props: ChartArrowProps) =>
      props.size ? `-${props.size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-bottom-color: ${(props: ChartArrowProps) =>
      props.borderColor ? props.borderColor : "#fff"};
    margin-left: ${(props: ChartArrowProps) =>
      props.borderWidth
        ? `-${borderWidth(props.size, props.borderWidth)}px`
        : `-${borderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-left: -10px;
    }
    &:before {
      margin-left: -${borderWidth(10, 5)}px;
    }
  }
`

export const ChartArrowBottom = styled(ChartArrow)`
  bottom: 0;
  left: ${(props: ChartArrowProps) => (props.left ? props.left : "unset")};
  right: ${(props: ChartArrowProps) => (props.right ? props.right : "unset")};

  &:after,
  &:before {
    top: 100%;
    left: 50%;
  }

  &:after {
    border-top-color: ${(props: ChartArrowProps) =>
      props.backgroundColor ? props.backgroundColor : "transparent"};
    margin-left: ${(props: ChartArrowProps) =>
      props.size ? `-${props.size}px` : `-${defaultSize}px`};
  }
  &:before {
    border-top-color: ${(props: ChartArrowProps) =>
      props.borderColor ? props.borderColor : "#fff"};
    margin-left: ${(props: ChartArrowProps) =>
      props.borderWidth
        ? `-${borderWidth(props.size, props.borderWidth)}px`
        : `-${borderWidth(defaultSize, defaultBorderWidth)}px`};
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    &:after {
      margin-left: -10px;
    }
    &:before {
      margin-left: -${borderWidth(10, 5)}px;
    }
  }
`
