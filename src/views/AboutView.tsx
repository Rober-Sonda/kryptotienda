import React from 'react';
import AboutUs from '../components/AboutUs.tsx';

const AboutView: React.FC = () => {
  return (
    <div className="fade-in" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 300px)', display: 'flex', alignItems: 'center' }}>
      <AboutUs />
    </div>
  );
};

export default AboutView;
