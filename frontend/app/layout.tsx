import React from 'react';
import './globals.css';

export const metadata = {
  title: 'CardioVision 3D — Full Clinical AI Dashboard (Step 7)',
  description: 'Unified 3D coronary artery disease prediction and SHAP explainability platform integrating FastAPI, ML models, and React Three Fiber.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
