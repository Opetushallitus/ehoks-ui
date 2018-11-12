import React from "react"
import { keyframes } from "react-emotion"
import styled from "styled"

const SpinnerContainer = styled("div")`
  width: 100px;
  height: 18px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
`

const bounce = keyframes`
  0%,80%,to {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`

interface BounceProps {
  delay?: string
}
const Bounce = styled("div")`
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: #159ecb;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-fill-mode: both;
  animation-delay: ${(props: BounceProps) => props.delay || 0};
`
export interface LoadingSpinnerProps {
  /** Custom CSS class name */
  className?: string
  /** Custom role */
  role?: string
  /** WAI-ARIA label */
  ariaLabel?: string
}
/** Animated loading indicator  */
export const LoadingSpinner = ({
  className,
  role,
  ariaLabel
}: LoadingSpinnerProps) => (
  <SpinnerContainer className={className} role={role} aria-label={ariaLabel}>
    <Bounce delay="-.32s" />
    <Bounce delay="-.16s" />
    <Bounce />
  </SpinnerContainer>
)
