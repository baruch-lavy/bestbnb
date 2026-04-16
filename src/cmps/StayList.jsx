import React, { useState, useEffect , useRef } from "react"
import { useSelector } from "react-redux"
import { StayPreview } from "./StayPreview.jsx"
import { CategoryFilter } from "./CategoryFilter.jsx"
import { categories } from "../services/categories.service"
import { useSearchParams} from "react-router-dom"
import { Loading } from "./Loading.jsx"
import { categoryMappings } from '../services/amenities.service'
import { loadStays, setModalFilter } from "../store/actions/stay.actions.js"
import { getDefaultFilter } from "../services/stay/index.js"
import { userService } from "../services/user"


export function StayList() {
    const [searchParams , setSearchParams] = useSearchParams()
    const allStays = useSelector((state) => state.stayModule.stays)
    const searchData = useSelector((state) => state.search)
    const modalFilter = useSelector((state) => state.stayModule.modalFilter)
    const staysLoaded = useSelector((state) => state.stayModule.staysLoaded)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [filteredStays, setFilteredStays] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [wishlistIds, setWishlistIds] = useState([])
    const bottomDivRef = useRef()
    const [nextIdx, setNextIdx] = useState(0)

    function handleApplyModalFilter(newModalFilter) {
        setModalFilter(newModalFilter)
        const searchFilter = {
            destination: searchData.destination !== 'Anywhere' ? (searchData.destination || '') : '',
            startDate: searchData.startDate || '',
            endDate: searchData.endDate || '',
            guests: searchData.guests && searchData.guests !== 'Add guests'
                ? encodeURIComponent(JSON.stringify(searchData.guests))
                : '',
        }
        loadStays({ ...searchFilter, ...newModalFilter })
    }

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId)
        if (!categoryId) {
            setFilteredStays(allStays)
            return
        }

        const category = categories.find(cat => cat.id === categoryId)
        if (!category) return

        const categoryLabel = category.label
        const relevantTerms = categoryMappings[categoryLabel] || [categoryLabel.toLowerCase()]

        const filtered = allStays.filter(stay => {
            const stayType = stay.type?.toLowerCase()
            const stayLabels = stay.labels?.map(label => label.toLowerCase()) || []
            const amenities = stay.amenities?.map(amenity => amenity.toLowerCase()) || []
            const summary = stay.summary?.toLowerCase() || ''

            return relevantTerms.some(term => 
                stayType?.includes(term) ||
                stayLabels.some(label => label.includes(term)) ||
                amenities.some(amenity => amenity.includes(term)) ||
                summary.includes(term)
            )
        })

        const remainder = filtered.length % 6
        if (remainder !== 0) {
            const paddingNeeded = 6 - remainder
            const padding = Array(paddingNeeded).fill(null)
            setFilteredStays([...filtered, ...padding])
        } else {
            setFilteredStays(filtered)
        }
    }

 


    useEffect(() => {
        const user = userService.getLoggedinUser()
        if (user) {
            userService.getWishlist()
                .then(stays => setWishlistIds(stays.map(s => String(s._id))))
                .catch(err => console.error('Failed to load wishlist ids', err))
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        setFilteredStays(allStays)
        setIsLoading(false)
        const observer = new IntersectionObserver(entries => {
            const entry = entries[0]
            if (entry.isIntersecting) {
                setNextIdx(nextIdx => nextIdx + 1)
            }
        })

        observer.observe(bottomDivRef.current)
        

    }, [allStays])

    if (!staysLoaded || filteredStays === null) {
        return (
            <div className="stay-index">
                <CategoryFilter 
                    onSelectCategory={handleCategorySelect}
                    selectedCategory={selectedCategory}
                    modalFilter={modalFilter}
                    onApplyModalFilter={handleApplyModalFilter}
                />
                <Loading />
                <div ref={bottomDivRef} className='bottom-div'></div>
            </div>
        )
    }

    if (!filteredStays.length) {
        return (
            <div className="stay-index">
                <CategoryFilter 
                    onSelectCategory={handleCategorySelect}
                    selectedCategory={selectedCategory}
                    modalFilter={modalFilter}
                    onApplyModalFilter={handleApplyModalFilter}
                />
                <div className="no-results">
                    <h2>No exact matches</h2>
                    <p>Try changing or removing some of your filters or adjusting your search area.</p>
                    <button
                        className="remove-filter-btn"
                        onClick={() => handleApplyModalFilter({
                            minPrice: 0,
                            maxPrice: Infinity,
                            propertyType: '',
                            amenities: [],
                            minBedrooms: 0,
                            minBeds: 0,
                            minBathrooms: 0,
                        })}
                    >
                        Remove all filters
                    </button>
                </div>
                <div ref={bottomDivRef} className='bottom-div'></div>
            </div>
        )
    }
    
    return (
        <div className="stay-index">
            <CategoryFilter 
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory}
                modalFilter={modalFilter}
                onApplyModalFilter={handleApplyModalFilter}
            />
            <div className="stay-list-container">
                <ul className="stay-list clean-list">
                    {filteredStays.slice(0, nextIdx * 20).map((stay, index) => (
                        stay ? (
                            <li key={stay._id || index}>
                                <StayPreview stay={stay} wishlistIds={wishlistIds} />
                            </li>
                        ) : (
                            <li key={`empty-${index}`} className="empty-stay"></li>
                        )
                    ))}
                </ul>
            </div>
            <div ref={bottomDivRef} className='bottom-div'></div>
        </div>
    )
}
