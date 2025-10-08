import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from "lucide-react";
import { createPortal } from 'react-dom';

const MultiSelectCell = ({ value, options = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY + "px",
        left: rect.left + window.scrollX + "px",
        width: rect.width + "px",
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  const toggleOption = (option, e) => {
    e.stopPropagation();
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const removeValue = (val, e) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== val);
    onChange(newValues);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const visibleValues = selectedValues.slice(0, 1);
  const remainingCount = selectedValues.length - visibleValues.length;

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleDropdownClick}
        className="w-full px-3 py-2 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer min-h-[42px] bg-white flex items-center justify-between gap-2 relative"
      >
        <div className="flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 text-sm">Select options...</span>
          ) : (
            <div className="flex flex-wrap gap-1 items-center">
              {visibleValues.map((val, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded whitespace-nowrap"
                >
                  {val}
                  <button
                    onClick={(e) => removeValue(val, e)}
                    className="hover:bg-blue-200 rounded-full p-0.5 flex-shrink-0"
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  +{remainingCount} more
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {options.length > 0 ? (
              options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={(e) => toggleOption(option, e)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => {}}
                    className="w-4 h-4 cursor-pointer text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options available
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MultiSelectCell;
