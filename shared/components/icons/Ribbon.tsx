import React from "react"

const Ribbon = ({
  size = 16,
  color = "#fff"
}: {
  size?: number
  color?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 46.25 100"
    fill={color}
  >
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className="cls-1"
          d="M40.61,13.57l5.64,5.06-3.08,6.92,1.68,7.87-7,4v0l-2.93,6.6-7.25-.76-7,4-6-5.38-7.53-.78L5.63,33.8,0,28.74l3.08-6.92L1.4,14l7-4,3-6.65L18.56,4l7-4,6,5.38L39,6.16l1.39,6.51Zm-3.15,1-1.15-5.4-6.24-.65-5-4.46L19.34,7.39l-6-.63-2.46,5.52L5.11,15.62,6.5,22.14,4,27.87l4.67,4.2,1.31,6.14,6.25.65,4.95,4.46L26.9,40l6,.63,2.43-5.48v0l5.8-3.36-1.39-6.52,2.55-5.73-4.67-4.2Z"
        />
        <path
          className="cls-1"
          d="M15.26,43.85C16,67.42,7.91,100,7.91,100H21.73l1.46-52.86-2.6,1.5Z"
        />
        <path
          className="cls-1"
          d="M24.14,46.59,28.05,100H38.6S35.11,64.6,30.5,44.67l-2.57-.27Z"
        />
        <polygon
          className="cls-1"
          points="13.18 24.86 19.81 31.49 33.06 18.23 30.73 15.88 19.81 26.8 15.52 22.52 13.18 24.86"
        />
      </g>
    </g>
  </svg>
)

export default Ribbon
