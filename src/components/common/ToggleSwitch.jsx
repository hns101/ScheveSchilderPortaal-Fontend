import React from 'react';
import './ToggleSwitch.css'; // We'll create this next

const ToggleSwitch = ({ label, checked, onChange, disabled = false }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="slider round"></span>
            <span className="toggle-label">{label}</span>
        </label>
    );
};

export default ToggleSwitch;
