// src/components/TextEditor.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ value, setValue, placeholder }) => {

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            style={{ height: '250px', marginTop: '10px' }}
            placeholder={placeholder}
        />
    );
};

const modules = {
    toolbar: [
        ['bold', 'italic'],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'list',
    'bullet',
    'link',
];

export default TextEditor;
