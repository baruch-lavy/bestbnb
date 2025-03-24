import React, { useState, useEffect , useRef } from "react"
import { useSelector } from "react-redux"
import { StayPreview } from "./StayPreview.jsx"
import { CategoryFilter } from "./CategoryFilter.jsx"
import { categories } from "../services/categories.service"
import { useSearchParams} from "react-router-dom"
import { Loading } from "./Loading.jsx"
import { categoryMappings } from '../services/amenities.service'


export function StayList() {
    const [searchParams , setSearchParams] = useSearchParams() // ✅ Extract query params
    const allStays = useSelector((state) => state.stayModule.stays)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [filteredStays, setFilteredStays] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const bottomDivRef = useRef()
    const [nextIdx, setNextIdx] = useState(0)

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

    if (!filteredStays?.length) {
        return (
            <div className="stay-index">
                <CategoryFilter 
                    onSelectCategory={handleCategorySelect}
                    selectedCategory={selectedCategory}
                />
                {/* <div className="no-stays-message">
                    <h2>No stays found</h2>
                    <p>Try adjusting your search criteria or removing some filters</p>
                </div> */}
                < Loading />
                <div ref={bottomDivRef} className='bottom-div'></div>
            </div>
        )
    }
    
    return (
        <div className="stay-index">
            <CategoryFilter 
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory}
            />
            <div className="stay-list-container">
                <ul className="stay-list clean-list">
                    {filteredStays.slice(0, nextIdx * 20).map((stay, index) => (
                        stay ? (
                            <li key={stay._id || index}>
                                <StayPreview stay={stay}/>
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
