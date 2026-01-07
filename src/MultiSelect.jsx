import React, { useRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';

const MultiSelect = ({
  options,
  selectedValues,
  onSelect,
  onRemove,
  placeholder
}) => {

  const multiSelectRef = useRef(null);

  const handleSelect = (selectedList, selectedItem) => {
    onSelect(selectedList, selectedItem);

    // ✅ FORCE CLOSE DROPDOWN (library-safe)
    setTimeout(() => {
      if (multiSelectRef.current?.searchBox?.current) {
        multiSelectRef.current.searchBox.current.blur();
      }
    }, 0);
  };

  return (
    <div style={{ margin: '0px 0' }}>
      <Multiselect
        ref={multiSelectRef}
        options={options}
        displayValue="name"
        selectedValues={selectedValues}
        onSelect={handleSelect}
        onRemove={onRemove}
        showCheckbox
        placeholder={placeholder || 'Select options'}
      />
    </div>
  );
};

export default MultiSelect;
