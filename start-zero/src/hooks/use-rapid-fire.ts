import { useEffect, useState } from 'react'

/**
 * A hook that provides rapid-fire functionality for a callback when a button is held down.
 * @param callback The function to call repeatedly
 * @param delay Initial delay before rapid firing starts (in ms)
 * @returns Event handlers to attach to a button element
 */
export const useRapidFire = (callback: () => void, delay = 500) => {
	const [isPressed, setIsPressed] = useState(false)

	useEffect(() => {
		let timeout: NodeJS.Timeout
		let interval: NodeJS.Timeout

		if (isPressed) {
			// Initial delay before rapid fire starts
			timeout = setTimeout(() => {
				// Start rapid fire
				interval = setInterval(callback, 1)
			}, delay)
		}

		return () => {
			clearTimeout(timeout)
			clearInterval(interval)
		}
	}, [isPressed, callback, delay])

	return {
		onMouseDown: () => {
			callback() // Immediate first action
			setIsPressed(true)
		},
		onMouseUp: () => setIsPressed(false),
		onMouseLeave: () => setIsPressed(false),
		onTouchStart: () => {
			callback() // Immediate first action
			setIsPressed(true)
		},
		onTouchEnd: () => setIsPressed(false),
	}
}

export default useRapidFire
