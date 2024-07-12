import React from 'react';
import Select from 'react-select';
import Flag from 'react-world-flags';

// Exemple de données de pays avec codes ISO 3166-1 alpha-2
const countries = [
  { value: 'US', label: 'United States' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'IN', label: 'India' },
  // Ajoutez d'autres pays selon vos besoins
];

// Style personnalisé pour afficher les drapeaux
const customStyles = {
  option: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center'
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center'
  }),
};

const FlagSelect = ({ selectedCountry, handleChange }) => (
  <Select
    value={countries.find(c => c.value === selectedCountry)}
    onChange={handleChange}
    options={countries}
    styles={customStyles}
    formatOptionLabel={({ value, label }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Flag code={value} style={{ width: 20, marginRight: 10 }} />
        {label}
      </div>
    )}
  />
);

export default FlagSelect;
