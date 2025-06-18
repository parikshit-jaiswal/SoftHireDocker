import { useState, useRef, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';

export default function MultiAddInput({ value = [], onChange, suggestions = [], placeholder, disabled = false }) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Use value from props as the source of truth
    const skills = value;

    const filteredSuggestions = suggestions.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !skills.includes(skill)
    );

    const addSkill = (skill) => {
        if (skill && !skills.includes(skill)) {
            const newSkills = [...skills, skill];
            onChange && onChange(newSkills);
        }
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeSkill = (skillToRemove) => {
        const newSkills = skills.filter(skill => skill !== skillToRemove);
        onChange && onChange(newSkills);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addSkill(inputValue.trim());
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full max-w-4xl space-y-4 ${disabled ? 'opacity-50' : ''}`}>
            {/* Selected skills */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-muted border border-border text-sm rounded-full px-3 py-1"
                    >
                        {skill}
                        <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-muted-foreground hover:text-destructive"
                            disabled={disabled}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input with icon */}
            <div className="relative">
                <div className={`flex items-center border border-input rounded-md px-3 py-2 bg-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Search className="w-5 h-5 text-muted-foreground mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            if (!disabled) {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder || 'Add'}
                        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                        disabled={disabled}
                    />
                </div>

                {/* Suggestions dropdown */}
                {!disabled && showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-popover bg-popover text-popover-foreground shadow-lg">
                        <div className="p-1">
                            {filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        addSkill(suggestion);
                                    }}
                                    className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Plus className="w-4 h-4 text-muted-foreground mr-2" />
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
