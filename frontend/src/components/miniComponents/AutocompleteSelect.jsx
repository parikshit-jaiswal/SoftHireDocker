import { useState, useRef, useEffect } from 'react';

const AutocompleteSelect = ({ options, placeHolder, disabled = false, onSelect, value }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  // Sync inputValue with value prop
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    if (!disabled) {
      setInputValue(e.target.value);
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    if (!disabled) {
      setInputValue(option);
      setIsOpen(false);
      onSelect?.(option);
    }
  };

  return (
    <div className={`relative w-full ${disabled ? 'opacity-50' : ''}`} ref={wrapperRef}>
      <input
        type="text"
        className={`w-full h-10 border border-input rounded-md px-3 py-2 text-sm ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
        placeholder={placeHolder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      />

      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      {!disabled && isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto border border-gray-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, i) => (
              <li
                key={i}
                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSelect;