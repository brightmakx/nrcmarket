'use client';

import { useState } from 'react';
import Link from 'next/link';

export function MobileMenu({ categories }: { categories: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="menu-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? '✕' : '>>'}
      </button>

      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <Link className="add-service-btn" href="/service/add-service">add service &gt;</Link>
        <h5>Your Preferences</h5>
        <div className="options">
          <h5>category</h5>
          {categories.map((x) => (
            <button className="filterOptions" key={x}>{x}</button>
          ))}
        </div>
      </div>
    </>
  );
}