// src/pages/main.tsx (or wherever your entry point is)
import React from 'react';
import HomePage from './home_page/page';  // Import the new HomePage component

const MainPage: React.FC = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

export default MainPage;
