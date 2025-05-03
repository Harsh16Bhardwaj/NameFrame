import React from 'react';

const HeaderSpacer: React.FC = () => {
  return (
    <>
      {/* This creates space only for the header height */}
      <div className="w-full h-16 mb-4" />
      
      {/* This negative margin pulls content up to create the floating effect */}
      <div className="w-full -mt-6" />
    </>
  );
};

export default HeaderSpacer;