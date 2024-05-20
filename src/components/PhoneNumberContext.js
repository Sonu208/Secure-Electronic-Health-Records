// PhoneNumberContext.js
import React, { createContext, useContext, useState } from 'react';

const PhoneNumberContext = createContext();

export const usePhoneNumber = () => useContext(PhoneNumberContext);

export const PhoneNumberProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber }}>
      {children}
    </PhoneNumberContext.Provider>
  );
};