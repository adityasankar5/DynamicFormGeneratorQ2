import React from 'react';
import { UserProvider } from './context/UserContext';
import { FormProvider } from './context/FormContext';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <UserProvider>
      <FormProvider>
        <MainLayout />
      </FormProvider>
    </UserProvider>
  );
}

export default App;