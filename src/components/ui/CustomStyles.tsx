import React from 'react';

export const CustomStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes gradient-slow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .animate-gradient-slow {
        background-size: 200% 200%;
        animation: gradient-slow 15s ease infinite;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-float-delay {
        animation: float 7s ease-in-out 1s infinite;
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .rotate-y-10 {
        transform: rotateY(10deg);
      }
      
      .rotate-x-5 {
        transform: rotateX(5deg);
      }
      
      .bg-grid-pattern {
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .font-script {
        font-family: 'Playfair Display', serif;
      }
    `}</style>
  );
};