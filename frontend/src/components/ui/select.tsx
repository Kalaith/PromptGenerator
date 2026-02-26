import React, { useState, createContext, useContext } from 'react';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <SelectContentProvider onClose={() => setIsOpen(false)}>
            {children}
          </SelectContentProvider>
        </div>
      )}
    </>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = useContext(SelectContext);
  return <span>{context?.value || placeholder}</span>;
};

interface SelectContentProviderProps {
  children: React.ReactNode;
  onClose: () => void;
}

const SelectContentProvider: React.FC<SelectContentProviderProps> = ({ children, onClose }) => {
  const context = useContext(SelectContext);
  
  const handleSelect = (value: string) => {
    context?.onValueChange(value);
    onClose();
  };

  return (
    <div className="max-h-60 overflow-auto">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectContent) {
          return React.cloneElement(child as React.ReactElement<SelectContentProps>, { onSelect: handleSelect });
        }
        return null;
      })}
    </div>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, onSelect }) => {
  const context = useContext(SelectContext);
  
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          const itemProps = child.props as { value: string; children: React.ReactNode };
          return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
            isSelected: context?.value === itemProps.value,
            onSelect: () => onSelect?.(itemProps.value)
          });
        }
        return child;
      })}
    </>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value: _value, children, isSelected, onSelect }) => {
  return (
    <div
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-600' : ''}`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};
