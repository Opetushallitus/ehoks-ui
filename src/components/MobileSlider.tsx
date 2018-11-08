import React from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import SwipeableViews from "react-swipeable-views"
import styled from "styled"

export const Slide = styled("div")`
  padding: 20px 25px 40px 25px;
`

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0;
  margin: 10px 0;
  background: #fff;
  color: #2b2b2b;
  border-radius: 2px;
  border: 1px solid #999;
`

const Count = styled("div")`
  position: absolute;
  bottom: 10px;
  margin: 0 0 0 25px;
`

const LeftArrow = styled(MdChevronLeft)`
  position: absolute;
  left: -4px;
  top: calc(50% - 16px);
  fill: ${props => props.theme.colors.waterBlue};
`

const RightArrow = styled(MdChevronRight)`
  position: absolute;
  right: -4px;
  top: calc(50% - 16px);
  fill: ${props => props.theme.colors.waterBlue};
`

interface MobileSliderProps {
  /**
   * Shows count of slides at the bottom of the slider
   * @default true
   */
  showCount?: boolean
  /** Slides */
  children?: React.ReactNode[]
  /** Renders custom element at the end of the slider */
  footer?: React.ReactNode
  /** Callback that gets called when slide is changed using arrows or swipe events */
  onSlideChange?: (index: number) => void
}

interface MobileSliderState {
  index: number
}

export class MobileSlider extends React.Component<
  MobileSliderProps,
  MobileSliderState
> {
  state = {
    index: 0
  }

  handleChangeIndex = (index: number) => {
    this.setState(
      {
        index
      },
      () => {
        if (this.props.onSlideChange) {
          this.props.onSlideChange(this.state.index)
        }
      }
    )
  }

  back = () => {
    this.handleChangeIndex(this.state.index - 1)
  }

  forward = () => {
    this.handleChangeIndex(this.state.index + 1)
  }

  render() {
    const { children, footer, showCount = true } = this.props
    if (!children.length) {
      return null
    }
    return (
      <Container>
        <SwipeableViews
          index={this.state.index}
          onChangeIndex={this.handleChangeIndex}
        >
          {children}
        </SwipeableViews>
        {this.state.index > 0 && <LeftArrow size={32} onClick={this.back} />}
        {this.state.index < children.length - 1 && (
          <RightArrow size={32} onClick={this.forward} />
        )}
        {showCount && (
          <Count>
            {this.state.index + 1}/{children.length}
          </Count>
        )}
        {footer}
      </Container>
    )
  }
}
