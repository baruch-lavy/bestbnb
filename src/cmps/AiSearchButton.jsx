import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { httpService } from '../services/http.service'
import { loadStays, setSearchData } from '../store/actions/stay.actions'
import { getDefaultFilter } from '../services/stay'

const LIMIT_KEY = 'ai_limit_reset'

function isLimitActive() {
    const resetAt = localStorage.getItem(LIMIT_KEY)
    if (!resetAt) return false
    return new Date(resetAt) > new Date()
}

export function AiSearchButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [limited, setLimited] = useState(isLimitActive)
    const panelRef = useRef(null)
    const btnRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target) &&
                btnRef.current &&
                !btnRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function onSubmit() {
        if (!query.trim() || isLoading || limited) return
        setIsLoading(true)
        setError(null)
        try {
            const parsed = await httpService.post('ai/parse-filter', { query: query.trim() })

            // Build filter: default values + AI-parsed values
            const filter = { ...getDefaultFilter() }

            if (parsed.destination) filter.destination = parsed.destination
            if (parsed.minPrice != null) filter.minPrice = parsed.minPrice
            if (parsed.maxPrice != null) filter.maxPrice = parsed.maxPrice
            if (parsed.minBedrooms != null) filter.minBedrooms = parsed.minBedrooms
            if (parsed.minBeds != null) filter.minBeds = parsed.minBeds
            if (parsed.minBathrooms != null) filter.minBathrooms = parsed.minBathrooms
            if (parsed.amenities?.length) filter.amenities = parsed.amenities
            if (parsed.category) filter.category = parsed.category
            if (parsed.startDate) filter.startDate = parsed.startDate
            if (parsed.endDate) filter.endDate = parsed.endDate
            if (parsed.guests) filter.guests = JSON.stringify(parsed.guests)

            // Sync Redux search bar state (destination, dates, guests)
            await setSearchData({
                destination: filter.destination || 'Anywhere',
                startDate: filter.startDate || null,
                endDate: filter.endDate || null,
                guests: filter.guests || 'Add guests',
            })

            await loadStays(filter)

            setIsOpen(false)
            setQuery('')
            navigate('/', { state: { aiFilter: filter } })
        } catch (err) {
            if (err?.response?.status === 429) {
                const resetAt = err.response.data?.resetAt
                if (resetAt) localStorage.setItem(LIMIT_KEY, resetAt)
                setLimited(true)
                setError('נגמרו לך הקרדיטים, נסה שוב מחר')
            } else {
                setError('משהו השתבש, נסה שוב')
            }
        } finally {
            setIsLoading(false)
        }
    }

    function onKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <div className="ai-search-btn-wrapper">
            <button
                ref={btnRef}
                className={`ai-fab-btn${isOpen ? ' open' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="AI Search"
                title="חיפוש AI"
            >
                <span className="ai-fab-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
                        <path d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z" fill="currentColor" opacity="0.7"/>
                    </svg>
                </span>
                <span className="ai-fab-label">AI</span>
            </button>

            {isOpen && (
                <div ref={panelRef} className="ai-search-panel">
                    <div className="ai-panel-header">
                        <span className="ai-panel-sparkle">✨</span>
                        <p className="ai-panel-title">
                            כתוב כאן מה אתה מחפש בדירה שלך ואנחנו כבר נמצא לך את הדירה המתאימה
                        </p>
                    </div>
                    {limited
                        ? <p className="ai-panel-error ai-panel-limit">נגמרו לך הקרדיטים, נסה שוב מחר 🙏</p>
                        : <>
                            <div className="ai-panel-body">
                                <textarea
                                    className="ai-search-input"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="דירה בלב מנהטן עם 2 חדרים ו4 מיטות עבור 2 מבוגרים וכלב מ-20/8 עד 24/8"
                                    rows={3}
                                    dir="rtl"
                                    autoFocus
                                    disabled={isLoading}
                                />
                                <button
                                    className={`ai-search-submit${isLoading ? ' loading' : ''}`}
                                    disabled={!query.trim() || isLoading}
                                    onClick={onSubmit}
                                >
                                    {isLoading
                                        ? <span className="ai-spinner" />
                                        : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                    }
                                </button>
                            </div>
                            {error && <p className="ai-panel-error">{error}</p>}
                        </>
                    }
                </div>
            )}
        </div>
    )
}
