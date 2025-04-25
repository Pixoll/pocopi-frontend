import React from 'react';
import './CustomTextField.css';

interface CustomTextFieldProps {
    width: string;
    height: string;
    hintText: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ width, height, hintText }) => {
    return (
        <input
            className="custom-text-field"
            style={{ width, height }}
            type="text"
            placeholder={hintText}
        />
    );
};

export default CustomTextField;
