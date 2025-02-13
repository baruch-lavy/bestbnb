import { useState, useEffect } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { categories } from '../services/categories.service'

export function StayFilter({ filterBy, setFilterBy }) {
    const [ filterToEdit, setFilterToEdit ] = useState(structuredClone(filterBy))
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value

        switch (type) {
            case 'text':
            case 'radio':
                value = field === 'sortDir' ? +ev.target.value : ev.target.value
                if(!filterToEdit.sortDir) filterToEdit.sortDir = 1
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit({ ...filterToEdit, [field]: value })
    }

    function handleCategorySelect(categoryId) {
        const category = categories.find(cat => cat.id === categoryId)
        setSelectedCategory(categoryId)
        
        setFilterToEdit(prevFilter => ({
            ...prevFilter,
            category: category.label
        }))
    }

    function clearFilter() {
        setFilterToEdit({ ...filterToEdit, txt: '', minPrice: '', maxPrice: '' })
    }
    
    function clearSort() {
        setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
    }

    return <section className="stay-filter">
            <h3>Filter:</h3>
            <input
                type="text"
                name="txt"
                value={filterToEdit.txt}
                placeholder="Free text"
                onChange={handleChange}
                required
            />
            <CategoryFilter 
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory}
            />
            <input
                type="number"
                min="0"
                name="minPrice"
                value={filterToEdit.minPrice}
                placeholder="min. price"
                onChange={handleChange}
                required
            />
            <button 
                className="btn-clear" 
                onClick={clearFilter}>Clear</button>
            <h3>Sort:</h3>
            <div className="sort-field">
                <label>
                    <span>Price</span>
                    <input
                        type="radio"
                        name="sortField"
                        value="price"
                        checked={filterToEdit.sortField === 'price'}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Name</span>
                    <input
                        type="radio"
                        name="sortField"
                        value="name"
                        checked={filterToEdit.sortField === 'name'}            
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Host</span>
                    <input
                        type="radio"
                        name="sortField"
                        value="host"
                        checked={filterToEdit.sortField === 'host'}                        
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="sort-dir">
                <label>
                    <span>Asce</span>
                    <input
                        type="radio"
                        name="sortDir"
                        value="1"
                        checked={filterToEdit.sortDir === 1}                        
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Desc</span>
                    <input
                        type="radio"
                        name="sortDir"
                        value="-1"
                        onChange={handleChange}
                        checked={filterToEdit.sortDir === -1}                        
                    />
                </label>
            </div>
            <button 
                className="btn-clear" 
                onClick={clearSort}>Clear</button>
    </section>
}