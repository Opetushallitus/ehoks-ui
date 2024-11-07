import React from "react"
import styled from "styled"
import { SwipeableViews } from "./SwipeableViews"

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

interface MobileSliderProps {
  /** Slides */
  children: React.ReactNode
  /** Renders custom element at the end of the slider */
  footer?: React.ReactNode
  /** Callback that gets called when slide is changed using arrows or swipe events */
  onSlideChange?: (index: number) => void
  /** Custom className */
  className?: string
}

export const MobileSlider: React.FC<MobileSliderProps> = ({
  children,
  className,
  footer,
  onSlideChange
}) =>
  React.Children.count(children) > 0 ? (
    <Container className={className}>
      <SwipeableViews onSlideChange={onSlideChange}>{children}</SwipeableViews>
      {footer}
    </Container>
  ) : null

export const Slide = styled("div")`
  padding: 15px 30px;
`
