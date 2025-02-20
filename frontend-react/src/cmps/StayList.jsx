import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StayPreview } from "./StayPreview.jsx";
import { CategoryFilter } from "./CategoryFilter.jsx";
import { categories } from "../services/categories.service";
import { useLocation  , useSearchParams} from "react-router-dom";

// const location = useLocation();

export function StayList() {
    const [searchParams , setSearchParams] = useSearchParams(); // ✅ Extract query params
    const allStays = useSelector((state) => state.stayModule.stays);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredStays, setFilteredStays] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const categoryMappings = {
        'Villa': ['villa', 'mansion'],
        'Cabin': ['cabin', 'wooden house'],
        'Cottage': ['cottage', 'rural'],
        'Penthouse': ['penthouse', 'luxury apartment'],
        'Apartment': ['apartment', 'flat', 'condo'],
        'Beachfront': ['beachfront', 'beach', 'seaside', 'ocean view'],
        'Luxury': ['luxury', 'premium', 'exclusive'],
        'Cabins': ['cabin', 'log cabin', 'wooden house'],
        'Countryside': ['countryside', 'rural', 'farm', 'pastoral'],
        'Lakefront': ['lakefront', 'lake view', 'lake house'],
        'Islands': ['island', 'tropical', 'private island'],
        'Beach': ['beach', 'coastal', 'seaside'],
        'Tiny homes': ['tiny house', 'small house', 'compact'],
        'Design': ['design', 'modern', 'architectural'],
        'Camping': ['camping', 'camp', 'glamping', 'outdoor'],
        'Arctic': ['arctic', 'snow', 'ice', 'winter'],
        'Desert': ['desert', 'arid', 'oasis'],
        'Tropical': ['tropical', 'paradise', 'exotic'],
        'Windmills': ['windmill', 'historic', 'unique'],
        'Caves': ['cave', 'cavern', 'grotto'],
        'Skiing': ['ski', 'winter sports', 'mountain'],
        'Farms': ['farm', 'ranch', 'countryside'],
        'Historical': ['historical', 'heritage', 'classic'],
        'Vineyard': ['vineyard', 'wine country', 'winery'],
        'Forest': ['forest', 'woods', 'nature'],
        'Mountain': ['mountain', 'alpine', 'hill'],
        'Lighthouse': ['lighthouse', 'coastal', 'scenic'],
        'Containers': ['container', 'modern', 'unique'],
        'Domes': ['dome', 'geodesic', 'unique'],
        'Boats': ['boat', 'houseboat', 'yacht'],
        'Treehouses': ['treehouse', 'nature', 'unique'],
        'Yurts': ['yurt', 'glamping', 'unique'],
        'Golfing': ['golf', 'resort', 'sport'],
        'Lake': ['lake', 'waterfront', 'lakeside'],
        'Surfing': ['surf', 'beach', 'ocean'],
        'A-frames': ['a-frame', 'cabin', 'unique'],
        'Barns': ['barn', 'converted', 'rustic'],
        'Towers': ['tower', 'unique', 'views'],
        'Houseboats': ['houseboat', 'boat', 'water'],
        'Chalets': ['chalet', 'ski', 'mountain'],
        'Riads': ['riad', 'moroccan', 'traditional'],
        'Trulli': ['trullo', 'italian', 'traditional'],
        'Cycladic': ['cycladic', 'greek', 'mediterranean'],
        'Shepherd': ['shepherd', 'rural', 'pastoral'],
        'Campers': ['camper', 'rv', 'mobile'],
        'Earth homes': ['earth house', 'eco', 'sustainable'],
        'Creative spaces': ['creative', 'artistic', 'unique'],
        'Ryokans': ['ryokan', 'japanese', 'traditional'],
        'Minsus': ['minsu', 'taiwanese', 'traditional'],
        'Casas particulares': ['casa particular', 'cuban', 'traditional'],
        'Hanoks': ['hanok', 'korean', 'traditional'],
        'Grand pianos': ['piano', 'musical', 'artistic'],
        'Off-grid': ['off-grid', 'eco', 'remote'],
        'Ski-in/out': ['ski-in/out', 'ski', 'winter sports'],
        'Vineyards': ['vineyard', 'wine', 'countryside']
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        if (!categoryId) {
            setFilteredStays(allStays);
            return;
        }

        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return;

        const categoryLabel = category.label;
        const relevantTerms = categoryMappings[categoryLabel] || [categoryLabel.toLowerCase()];

        const filtered = allStays.filter(stay => {
            const stayType = stay.type?.toLowerCase();
            const stayLabels = stay.labels?.map(label => label.toLowerCase()) || [];
            const amenities = stay.amenities?.map(amenity => amenity.toLowerCase()) || [];
            const summary = stay.summary?.toLowerCase() || '';

            return relevantTerms.some(term => 
                stayType?.includes(term) ||
                stayLabels.some(label => label.includes(term)) ||
                amenities.some(amenity => amenity.includes(term)) ||
                summary.includes(term)
            );
        });

        const remainder = filtered.length % 6;
        if (remainder !== 0) {
            const paddingNeeded = 6 - remainder;
            const padding = Array(paddingNeeded).fill(null);
            setFilteredStays([...filtered, ...padding]);
        } else {
            setFilteredStays(filtered);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setFilteredStays(allStays);
        setIsLoading(false);
    }, [allStays])

    if (!filteredStays?.length) {
        return (
            <div className="stay-index">
                <CategoryFilter 
                    onSelectCategory={handleCategorySelect}
                    selectedCategory={selectedCategory}
                />
                <div className="no-stays-message">
                    <h2>No stays found</h2>
                    <p>Try adjusting your search criteria or removing some filters</p>
                </div>
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
                    {filteredStays.map((stay, index) => (
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
        </div>
    );
}
