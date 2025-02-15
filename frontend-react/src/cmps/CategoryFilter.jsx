import { useState, useEffect } from 'react'
import { categories } from '../services/categories.service'
import { FiSliders } from 'react-icons/fi'

export function CategoryFilter({ onSelectCategory, selectedCategory }) {
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

    const checkScroll = () => {
        const container = document.querySelector('.category-list')
        if (!container) return

        setShowLeftButton(container.scrollLeft > 0)
        
        const isAtEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth
        setShowRightButton(!isAtEnd)
    }

    useEffect(() => {
        const container = document.querySelector('.category-list')
        if (container) {
            container.addEventListener('scroll', checkScroll)

            checkScroll()
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll)
            }
        }
    }, [])

    const scroll = (direction) => {
        const container = document.querySelector('.category-list')
        if (!container) return

      
        const itemWidth = container.querySelector('.category-item').offsetWidth
        const gap = 32 
        const scrollAmount = itemWidth + gap

       
        const visibleItems = Math.floor(container.offsetWidth / (itemWidth + gap))
        
        
        const scrollPixels = scrollAmount * visibleItems

        if (direction === 'left') {
            container.scrollBy({ 
                left: -scrollPixels, 
                behavior: 'smooth' 
            })
        } else {
            container.scrollBy({ 
                left: scrollPixels, 
                behavior: 'smooth' 
            })
        }
    }

    return (
        <div className="filter-container"> 
            <button className="filters-btn">
                <img src="/img/stays/icons/filter-icon.svg" alt="icon-filter" />
                Filters
            </button>
        <div className="category-filter">
            {showLeftButton && (
                <button 
                className="scroll-btn left" 
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                >
                    ❮
                </button>
            )}
            
            <div className="category-list">
                {categories.map(category => (
                    <div 
                    key={category.id}
                    className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
                    onClick={() => onSelectCategory(category.id)}
                    >
                        <div className="content">
                            <img src={category.icon} alt={category.label} />
                            <span>{category.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showRightButton && (
                <button 
                className="scroll-btn right" 
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                >
                    ❯
                </button>
            )}
        </div>
    </div>
    )
} 