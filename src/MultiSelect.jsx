import React from 'react';
import Multiselect from 'multiselect-react-dropdown';

const MultiSelect = ({ options, selectedValues, onSelect, onRemove, placeholder }) => (
  <div style={{ margin: '0px 0' }}>
    <Multiselect
      options={options}
      displayValue='name'
      selectedValues={selectedValues}
      onSelect={onSelect}
      onRemove={onRemove}
      showCheckbox
      placeholder={placeholder || 'Select options'}
    />
  </div>
);

export default MultiSelect;