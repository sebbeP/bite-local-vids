
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X } from 'lucide-react';

interface PostFormProps {
  onSubmit: (formData: PostFormData) => void;
  isSubmitting?: boolean;
}

export interface PostFormData {
  caption: string;
  cuisineType: string;
  priceRange: string;
  specialLabels: string[];
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<PostFormData>({
    caption: '',
    cuisineType: '',
    priceRange: '',
    specialLabels: []
  });
  const [newLabel, setNewLabel] = useState('');

  const specialLabelOptions = [
    'Lunch Deal', 'Dinner Special', 'Vegan', 'Vegetarian', 'Gluten-Free', 
    'Organic', 'Local Sourced', 'Chef Special', 'New Item', 'Seasonal'
  ];

  const addSpecialLabel = () => {
    if (newLabel && !formData.specialLabels.includes(newLabel)) {
      setFormData(prev => ({
        ...prev,
        specialLabels: [...prev.specialLabels, newLabel]
      }));
      setNewLabel('');
    }
  };

  const removeSpecialLabel = (label: string) => {
    setFormData(prev => ({
      ...prev,
      specialLabels: prev.specialLabels.filter(l => l !== label)
    }));
  };

  const addPredefinedLabel = (label: string) => {
    if (!formData.specialLabels.includes(label)) {
      setFormData(prev => ({
        ...prev,
        specialLabels: [...prev.specialLabels, label]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption or Description
        </label>
        <textarea
          value={formData.caption}
          onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
          placeholder="Describe your dish, event, or atmosphere..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Cuisine Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuisine Type
        </label>
        <select
          value={formData.cuisineType}
          onChange={(e) => setFormData(prev => ({ ...prev, cuisineType: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="">Select cuisine type</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
          <option value="American">American</option>
          <option value="French">French</option>
          <option value="Indian">Indian</option>
          <option value="Thai">Thai</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Korean">Korean</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <select
          value={formData.priceRange}
          onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="">Select price range</option>
          <option value="$">$ - Budget Friendly</option>
          <option value="$$">$$ - Moderate</option>
          <option value="$$$">$$$ - Upscale</option>
          <option value="$$$$">$$$$ - Fine Dining</option>
        </select>
      </div>

      {/* Special Labels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Labels
        </label>
        
        {/* Quick add buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {specialLabelOptions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => addPredefinedLabel(label)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                formData.specialLabels.includes(label)
                  ? 'bg-orange-100 border-orange-300 text-orange-700'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
              disabled={isSubmitting}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom label input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Add custom label..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={isSubmitting}
            onKeyPress={(e) => e.key === 'Enter' && addSpecialLabel()}
          />
          <Button
            type="button"
            size="sm"
            onClick={addSpecialLabel}
            disabled={!newLabel || isSubmitting}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected labels */}
        {formData.specialLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.specialLabels.map((label) => (
              <span
                key={label}
                className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1"
              >
                {label}
                <button
                  type="button"
                  onClick={() => removeSpecialLabel(label)}
                  className="hover:bg-orange-200 rounded-full p-0.5"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600">Location: Mama Rosa's Kitchen (Auto-tagged)</span>
      </div>
    </form>
  );
};

export default PostForm;
