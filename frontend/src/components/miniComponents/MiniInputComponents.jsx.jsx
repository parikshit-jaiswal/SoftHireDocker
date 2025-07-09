import React, { useState } from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


export function DateInput({ label = "Select Date", required = true, value, onChange }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <label className="block font-bold text-gray-900 text-sm ">{label}</label>
                {required && <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>}
            </div>
            <Popover className="w-full">
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!value}
                        className="data-[empty=true]:text-muted-foreground w-full  justify-start text-left font-normal"
                    >
                        <CalendarIcon />
                        {value ? format(value, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={value} onSelect={onChange} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export function FileUpload({ label = "Upload File", required = true, value, onChange }) {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file ? file.name : "");
        onChange(file)
    };

    return (
        <div className="w-full">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block font-bold text-gray-900 text-sm">{label}</label>
                    <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
                </div>

                <div className="relative">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="customFileInput"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        required={required}
                    />

                    {/* Custom styled label as button */}
                    <label
                        htmlFor="customFileInput"
                        className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-base text-gray-700 cursor-pointer hover:bg-gray-200 transition truncate"
                    >
                        {fileName || "Click to choose a file"}
                    </label>
                </div>
            </div>
        </div>
    );
}


export function Input({ label = "Label", placeholder = "", type = "text", required = true, value, onChange }) {
    return (
        <div className="w-full">
            <div className="">
                <div className="flex items-center justify-between mb-2">
                    <label className="block font-bold text-gray-900 text-sm ">{label}</label>
                    {required && <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>}
                </div>
                <input
                    type={type}
                    className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            </div>
        </div>
    );
}

export function Question({ name, label, answers, handleSelect, content }) {
    return (
        <div key={name} className="flex flex-col gap-2 sm:gap-0">
            <div className="flex items-center justify-between">
                <label className="block font-bold text-gray-900 text-sm sm:text-md">
                    {label}
                </label>
                <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                    Required
                </span>
            </div>
            {content && <div className="mt-2">{content}</div>}
            <div className="flex gap-3 mt-2">
                <button
                    type="button"
                    className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "Yes"
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                    onClick={() => handleSelect(name, "Yes")}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "No"
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                    onClick={() => handleSelect(name, "No")}
                >
                    No
                </button>
            </div>
        </div>
    );
}

export function OptionSelect({ value, onChange, options, label, required = true }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const filtered = options.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));
    return (
        <div>
            <label className="flex font-bold text-gray-900 mb-1 text-sm justify-between">{label} <span className="text-xs text-gray-400 font-normal ml-2 justify-end">{required ? "Required" : ""}</span></label>

            <div className="relative">
                <div
                    className="flex items-center bg-gray-100 rounded-lg px-3 py-3 cursor-pointer border focus-within:ring-2 focus-within:ring-blue-300"
                    onClick={() => setOpen(v => !v)}
                >
                    {value ? (
                        <span className="text-base">{value}</span>
                    ) : (
                        <span className="text-gray-400">Choose something</span>
                    )}
                    <svg className="ml-auto w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
                {open && (
                    <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                            className="w-full px-3 py-1 border-b outline-none text-base"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                        {filtered.map(c => (
                            <div
                                key={c.value}
                                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${value === c.label ? 'bg-gray-100' : ''}`}
                                onClick={() => { onChange(c.label); setOpen(false); }}
                            >
                                <span className="text-base">{c.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}