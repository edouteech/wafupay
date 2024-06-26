// components/InputWithLabel.tsx

import React, {useState} from 'react';
import styles from './InputWithLabel.module.css';

type InputWithLabelProps = {
  id: string;
  label: string;
  classes? : string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'tel' | 'search' | 'month'; // Types d'input possibles
};

const InputWithLabel: React.FC<InputWithLabelProps> = ({ id, label, type = 'text', classes='' }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(true);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type={type}
        id={id}
        name={id}
        className={styles.inputField + " " + classes}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      
      <label
        htmlFor={id}
        className={`${styles.label} ${focused ? styles.labelActive : ''}`}
      >
        {label}
      </label>
    </div>
  );
};

export default InputWithLabel;
