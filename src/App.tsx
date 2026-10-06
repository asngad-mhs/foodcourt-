import React from 'react';
import { MainPosLayout } from './layouts/MainPosLayout';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <MainPosLayout>
      <AppRouter />
    </MainPosLayout>
  );
}

export default App;
