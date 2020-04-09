import React from "react"

export default ({
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
      fill={color}
      viewBox="0 0 93.4 100"
    >
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <path
            className="cls-1"
            d="M38.27,100H65.71c5,0,9.11-4.5,9.11-10l0-56.94L56.53,51.32H45.42V40.22L74.77,10.87V10c0-5.5-4.07-10-9.11-10H9.15c-5,0-9.1,4.5-9.1,10L0,90c0,5.5,4.07,10,9.11,10H36.55"
          />
          <path
            className="cls-1"
            d="M75.5,11.36,46.35,40.51V50.4h9.88L85.39,21.24m2.41-2.41L92.63,14a2.61,2.61,0,0,0,0-3.71L86.46,4.12a2.63,2.63,0,0,0-3.72,0L77.92,8.94"
          />
        </g>
      </g>
    </svg>
  )
