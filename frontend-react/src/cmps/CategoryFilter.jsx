import { useState, useEffect, useRef } from "react";
import { categories } from "../services/categories.service";
import { FiSliders } from "react-icons/fi";
import { FilterModal } from "./FilterModal";

export function CategoryFilter({ onSelectCategory, selectedCategory }) {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const containerRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      onSelectCategory(null); // Deselect if clicking the same category
    } else {
      onSelectCategory(categoryId);
    }
  };

  // ✅ Updates visibility of left/right scroll buttons
  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isScrolledStart = container.scrollLeft > 0;
    const isScrolledEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 1;

    setShowLeftButton(isScrolledStart);
    setShowRightButton(!isScrolledEnd);

    // עדכון מחלקות הצל
    container.parentElement.classList.toggle('scrolled-start', isScrolledStart);
    container.parentElement.classList.toggle('scrolled-end', isScrolledEnd);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const item = container.querySelector(".category-item");
    if (!item) return;

    const itemWidth = item.offsetWidth;
    const gap = 32; // Assuming a 32px gap
    const scrollAmount = itemWidth + gap;

    // ✅ Scroll by full viewport width of items
    const visibleItems = Math.floor(container.offsetWidth / (itemWidth + gap));
    const scrollPixels = scrollAmount * visibleItems;

    container.scrollBy({
      left: direction === "left" ? -scrollPixels : scrollPixels,
      behavior: "smooth",
    });
  };

  return (
    <div className="filter-container">
      {/* Filters Button */}
      <button className="filters-btn" onClick={() => setIsFilterModalOpen(true)}>
        <img src="/img/stays/icons/filter-icon.svg" alt="icon-filter" />
        Filters
      </button>

      {/* Filters Modal */}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />

      {/* Category List */}
      <div className="category-filter">
        {/* Left Scroll Button */}
        {showLeftButton && (
          <button
            className="scroll-btn left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ❮
          </button>
        )}

        {/* Category Items */}
        <div className="category-list" ref={containerRef}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? "selected" : ""}`}
              onClick={() => handleCategoryClick(category.id)}
              role="button"
              tabIndex={0}
            >
              <div className="content">
                <img src={category.icon} alt={category.label} />
                <span>{category.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {showRightButton && (
          <button
            className="scroll-btn right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            ❯
          </button>
        )}
      </div>
    </div>
  );
}
