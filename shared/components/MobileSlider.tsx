import React, { useRef } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import SwipeableViews, { SwipeableViewsRef } from "react-swipeable-views-v18"
import styled from "styled"

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

const LeftArrow = styled(MdChevronLeft)`
  position: absolute;
  left: -4px;
  top: calc(50% - 16px);
  fill: ${props => props.theme.colors.green700};
`

const RightArrow = styled(MdChevronRight)`
  position: absolute;
  right: -4px;
  top: calc(50% - 16px);
  fill: ${props => props.theme.colors.green700};
`

interface MobileSliderProps {
  /** Slides */
  children?: React.ReactNode[]
  /** Renders custom element at the end of the slider */
  footer?: React.ReactNode
  /** Callback that gets called when slide is changed using arrows or swipe events */
  onSlideChange?: (index: number) => void
  /** Custom className */
  className?: string
}

export const MobileSlider: React.FC<MobileSliderProps> = ({ children = [], className, footer }) => {
  if (!children.length) {
    return null
  }
  const swipeableViewsRef = useRef<SwipeableViewsRef>(null)
  const handleSwipeForward = () => {
    swipeableViewsRef.current?.swipeForward()
  }
  const handleSwipeBackward = () => {
    swipeableViewsRef.current?.swipeBackward()
  }

  return (
    <Container className={className}>
      <SwipeableViews ref={swipeableViewsRef}>
        {children}
      </SwipeableViews>
      {<LeftArrow size={32} onClick={handleSwipeBackward} />}
      {(
        <RightArrow size={32} onClick={handleSwipeForward} />
      )}
      {footer}
    </Container>
  )
}

export const Slide = styled("div")`
  padding: 20px 25px 40px 25px;
`
