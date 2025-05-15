import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseLocation: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onUseLocation, isLoading }) => {
  const [city, setCity] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleLocationClick = () => {
    onUseLocation();
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="form-field">
            <input
              type="text"
              placeholder="Enter city name (e.g., London, Nairobi, New York)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input input-lg w-full"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isLoading || !city.trim()}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
            Search
          </button>
          <button 
            type="button" 
            onClick={handleLocationClick}
            className="btn btn-secondary btn-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            )}
            Use My Location
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;