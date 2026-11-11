import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Measures collapsible sidebar list content height for expand/collapse animation.
 */
export const useSidebarGroupListHeight = (expanded: boolean) => {
    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useLayoutEffect(() => {
        const el = ref.current
        if (!expanded || !el) {
            setHeight(0)
            return
        }

        const measure = () => {
            setHeight(el.getBoundingClientRect().height)
        }

        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(el)

        return () => observer.disconnect()
    }, [expanded])

    return { ref, height }
}
