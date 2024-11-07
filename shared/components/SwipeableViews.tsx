/* MIT License */
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  Ref,
  useCallback,
  useEffect
} from "react"
import "components/SwipeableViews.css"
import styled from "styled-components"

interface SwipeableViewsProps {
  children: React.ReactNode
  swipeThreshold?: number
  backButtonProps?: {
    text: string
  }
  forwardButtonProps?: {
    text: string
  }
  hideBackButton?: boolean
  hideForwardButton?: boolean
  onSlideChange?: (index: number) => void
}

export interface SwipeableViewsRef {
  swipeForward: () => void
  swipeBackward: () => void
}

const Container = styled("div")``

export const SwipeableViews = forwardRef(
  (
    {
      backButtonProps = { text: "<" },
      children,
      forwardButtonProps = { text: ">" },
      hideBackButton,
      hideForwardButton,
      swipeThreshold,
      onSlideChange
    }: SwipeableViewsProps,
    ref: Ref<SwipeableViewsRef>
  ) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [startX, setStartX] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragThreshold = swipeThreshold ?? 50 // Adjust the drag threshold using props

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      setStartX(event.clientX)
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (startX === 0) return

      const currentX = event.clientX
      const diffX = currentX - startX

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(calc(-${
          activeIndex * 100
        }% + ${diffX}px))`
      }
    }

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
      const currentX = event.clientX
      const diffX = currentX - startX

      if (diffX > dragThreshold) {
        swipeBackward()
      } else if (diffX < -dragThreshold) {
        swipeForward()
      }

      setStartX(0)
    }

    const handleMouseLeave = () => {
      setStartX(0)
    }

    const swipeForward = useCallback(() => {
      const newIndex = activeIndex + 1

      if (newIndex >= React.Children.count(children)) {
        setActiveIndex(0)
      } else if (newIndex < React.Children.count(children)) {
        setActiveIndex(newIndex)
      }
    }, [activeIndex, children])

    const swipeBackward = useCallback(() => {
      let newIndex = activeIndex - 1

      if (newIndex < 0) {
        newIndex = React.Children.count(children) - 1
      }

      setActiveIndex(newIndex)
    }, [activeIndex, children])

    useEffect(() => {
      if (onSlideChange) onSlideChange(activeIndex)
    }, [onSlideChange, activeIndex])

    useImperativeHandle(ref, () => ({
      swipeForward,
      swipeBackward
    }))

    const renderButton = (
      onClick: () => void,
      disabled: boolean,
      text: string,
      className: string
    ) => (
      <button onClick={onClick} disabled={disabled} className={className}>
        {text}
      </button>
    )

    const renderButtons = () => {
      const backButton =
        backButtonProps && !hideBackButton
          ? renderButton(
              () => {
                swipeBackward()
              },
              activeIndex === 0,
              backButtonProps.text,
              "back-button"
            )
          : null

      const forwardButton =
        forwardButtonProps && !hideForwardButton
          ? renderButton(
              () => {
                swipeForward()
              },
              activeIndex === React.Children.count(children) - 1,
              forwardButtonProps.text,
              "forward-button"
            )
          : null

      return (
        <div className="buttons-container">
          {backButton}
          {forwardButton}
        </div>
      )
    }

    return (
      <Container
        className="swipeable-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="slider-container"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.3s ease"
          }}
          ref={containerRef}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className="slide">
              {child}
            </div>
          ))}
        </div>
        {React.Children.count(children) > 1 && renderButtons()}
        {React.Children.count(children) > 1 && (
          <div className="pagination">
            {React.Children.map(children, (_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </Container>
    )
  }
)

SwipeableViews.displayName = "SwipeableViews"
