// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ courseTitle }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between h-16 px-8">
        <Link to="/">
          <img src={logoPage} alt="Logo" className="h-8 w-auto" />
        </Link>
        <h1 className="text-lg font-semibold">{courseTitle}</h1>
        <div>
          <button className="text-gray-600 hover:text-gray-800">Progress</button>
        </div>
      </div>
    </header>
  );
}
