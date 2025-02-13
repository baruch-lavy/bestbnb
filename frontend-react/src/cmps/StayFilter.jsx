import { useState, useEffect } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { categories } from '../services/categories.service'

export function StayFilter({ filterBy, setFilterBy }) {
    const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleCategorySelect(categoryId) {
        const category = categories.find(cat => cat.id === categoryId)
        
        if (selectedCategory === categoryId) {
            setSelectedCategory(null)
            setFilterToEdit(prevFilter => ({
                ...prevFilter,
                type: ''
            }))
        } else {
            setSelectedCategory(categoryId)
            setFilterToEdit(prevFilter => ({
                ...prevFilter,
                type: category.label
            }))
        }
    }

    return (
        <section className="stay-filter">
            <CategoryFilter 
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory}
            />
        </section>
    )
}