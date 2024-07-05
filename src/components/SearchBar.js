import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return ( 
    <><h1>Weather App</h1><div className="search-container">
      <input
        type="text"
        placeholder="Enter city or zip code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
         />
      <button onClick={handleSearch}>Search</button>
      <button onClick={() => navigator.geolocation.getCurrentPosition(position => onSearch(`${position.coords.latitude},${position.coords.longitude}`))}>Use My Location</button>
    </div></>
  );
};

export default SearchBar;
