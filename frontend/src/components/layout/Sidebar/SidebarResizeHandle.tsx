import { PointerEvent as ReactPointerEvent, useEffect } from 'react'

const STORAGE_KEY = 'raven-sidebar-width'
const MIN_WIDTH = 320
const MAX_WIDTH = 640
const MIN_CHAT_WIDTH = 360

export const SidebarResizeHandle = () => {
    useEffect(() => {
        const stored = Number(localStorage.getItem(STORAGE_KEY))
        if (Number.isFinite(stored) && stored > 0) {
            applyWidth(clampWidth(stored))
        }
        // Inline width overrides the mobile media query, so drop it when this desktop handle unmounts.
        return () => {
            document.documentElement.style.removeProperty('--sidebar-width')
        }
    }, [])

    return (
        <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            onPointerDown={startResize}
            className="absolute right-0 top-0 z-20 h-full w-1.5 cursor-col-resize touch-none hover:bg-gray-8"
        />
    )
}

function startResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = event.currentTarget.parentElement?.getBoundingClientRect().width ?? MIN_WIDTH
    const previousCursor = document.body.style.cursor
    const previousSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (ev: PointerEvent) => {
        applyWidth(clampWidth(startWidth + ev.clientX - startX))
    }
    const onUp = () => {
        const width = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'))
        if (Number.isFinite(width)) {
            localStorage.setItem(STORAGE_KEY, String(Math.round(width)))
        }
        document.body.style.cursor = previousCursor
        document.body.style.userSelect = previousSelect
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
}

function applyWidth(width: number) {
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
}

function clampWidth(width: number) {
    const max = Math.min(MAX_WIDTH, window.innerWidth - MIN_CHAT_WIDTH)
    return Math.round(Math.min(Math.max(width, MIN_WIDTH), Math.max(max, MIN_WIDTH)))
}
