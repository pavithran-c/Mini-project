import React from "react";
import './styles.css';

const ExtraIngredient = ({ ingredient, onSelect, isChecked }) => {
  const handleChange = () => {
    onSelect(ingredient); // Notify parent about the change
  };

  return (
    <div className="extraIngredient">
      <label className="container">
        {ingredient}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          aria-label={`Select ${ingredient}`} // Adds accessibility
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default ExtraIngredient;
