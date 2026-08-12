'use client';

import React from 'react';
import styles from './PropertyCard.module.css';
import { Property } from '../lib/api';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const imageUrl = property.primary_image_url || property.image_urls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={property.title} 
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.price}>${property.price} {property.price_label}</div>
        <div className={styles.title}>{property.title}</div>
        <div className={styles.address}>
          {property.address}, {property.city}, {property.state}
        </div>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>🛏️</span> {property.bedrooms} Beds
          </div>
          <div className={styles.detailItem}>
            <span>🛁</span> {property.bathrooms} Baths
          </div>
          {property.sqft && (
            <div className={styles.detailItem}>
              <span>📐</span> {property.sqft} sqft
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            className={`btn-primary ${styles.actionButton}`} 
            onClick={() => onSelect(property)}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}
