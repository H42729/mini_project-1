import React from 'react';
import {
  Scale,
  Search,
  X,
  ChevronDown,
  Sprout,
  RotateCcw
} from 'lucide-react';
import './Crops.css';
import { SectionHeader, Input, EmptyState, Button } from '../../../../components/ui';
import { useBuyer } from '../../context/BuyerContext';
import CropCard from '../../components/CropCard';

export default function Crops() {
  const {
    crops,
    filteredCrops,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    setDeclinedCropIds,
    t,
    lang,
    handleOpenAccept,
    handleOpenDecline
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <SectionHeader
        className="buyer-view-header"
        title={t('crops.title')}
        subtitle={t('crops.subtitle')}
        action={
          <div className="buyer-total-stock-badge">
            <Scale size={15} />
            <span>{t('crops.totalStock', { n: crops.reduce((acc, c) => acc + c.availableKg, 0) })}</span>
          </div>
        }
      />

      {/* Crops Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={18} />}
          rightIcon={searchQuery ? <X size={15} /> : undefined}
          onRightIconClick={searchQuery ? () => setSearchQuery('') : undefined}
        />
      </div>

      {/* Filters & Sorting Bar */}
      <div className="buyer-filter-toolbar">
        {/* Category Filter Chips */}
        <div className="buyer-filter-chips">
          <button
            type="button"
            className={`buyer-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('crops.filterAll')}
          </button>
          <button
            type="button"
            className={`buyer-chip ${selectedCategory === 'vegetables' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('vegetables')}
          >
            {t('crops.filterVegetables')}
          </button>
          <button
            type="button"
            className={`buyer-chip ${selectedCategory === 'fruits' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('fruits')}
          >
            {t('crops.filterFruits')}
          </button>
          <button
            type="button"
            className={`buyer-chip ${selectedCategory === 'grade_a' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('grade_a')}
          >
            {t('crops.filterGradeA')}
          </button>
          <button
            type="button"
            className={`buyer-chip ${selectedCategory === 'grade_b' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('grade_b')}
          >
            {t('crops.filterGradeB')}
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="buyer-sort-wrap">
          <label htmlFor="crop-sort-select" className="buyer-sort-label">
            {t('crops.sortBy')}
          </label>
          <div className="buyer-select-wrapper">
            <select
              id="crop-sort-select"
              className="buyer-select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">{t('crops.sortRecent')}</option>
              <option value="price_low">{t('crops.sortPriceLow')}</option>
              <option value="price_high">{t('crops.sortPriceHigh')}</option>
              <option value="qty_high">{t('crops.sortQtyHigh')}</option>
            </select>
            <ChevronDown size={14} className="buyer-select-arrow" />
          </div>
        </div>
      </div>

      {/* Crops Grid (Desktop 3-4, Tablet 2, Mobile 1) */}
      {filteredCrops.length > 0 ? (
        <div className="buyer-crop-grid">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              lang={lang}
              t={t}
              onAccept={() => handleOpenAccept(crop)}
              onDecline={() => handleOpenDecline(crop)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Sprout size={32} />}
          title={t('crops.emptyTitle')}
          description={t('crops.emptyDesc')}
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDeclinedCropIds([]);
              }}
              leftIcon={<RotateCcw size={15} />}
            >
              <span>{t('crops.resetFilters')}</span>
            </Button>
          }
        />
      )}
    </div>
  );
}
