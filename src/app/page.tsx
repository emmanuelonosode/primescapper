'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Property, searchProperties } from '../lib/api';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const fetchProperties = async (query = '') => {
    setLoading(true);
    const data = await searchProperties(query);
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(searchQuery);
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="title">Prime Social Scrapper</h1>
          <p className="subtitle">Search properties to download images and generate social media posts.</p>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search by city, ZIP, or keywords (e.g. '2 beds Austin')" 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={`btn-primary ${styles.searchButton}`}>
              Search
            </button>
          </form>
        </div>
      </section>

      <section className={styles.results}>
        <div className="container">
          {loading ? (
            <div className={styles.emptyState}>
              <h2>Loading properties...</h2>
            </div>
          ) : properties.length > 0 ? (
            <div className={styles.grid}>
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onSelect={setSelectedProperty}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>No properties found</h2>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </main>
  );
}
