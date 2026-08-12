'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from './PropertyModal.module.css';
import { Property, getPropertyDetail } from '../lib/api';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyModal({ property: initialProperty, onClose }: PropertyModalProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      const detail = await getPropertyDetail(initialProperty.slug);
      if (detail) {
        setProperty(detail);
        generateCaption(detail);
      } else {
        setProperty(initialProperty);
        generateCaption(initialProperty);
      }
      setLoading(false);
    }
    load();
  }, [initialProperty]);

  const generateCaption = (p: Property) => {
    const amenities = p.amenities ? p.amenities.map(a => a.name).join(', ') : '';
    const descExcerpt = p.description ? p.description.substring(0, 150) + '...' : '';
    
    const text = `🏡 New Listing Alert! ✨\n\n` +
      `Check out this stunning property in ${p.city}, ${p.state}!\n\n` +
      `📍 ${p.title}\n` +
      `💰 $${p.price} ${p.price_label}\n` +
      `🛏️ ${p.bedrooms} Beds | 🛁 ${p.bathrooms} Baths ${p.sqft ? `| 📐 ${p.sqft} sqft` : ''}\n\n` +
      `${descExcerpt}\n\n` +
      (amenities ? `✨ Features: ${amenities}\n\n` : '') +
      `DM us or visit primefamilyhousing.com to schedule a tour! 🔑\n\n` +
      `#PrimeFamilyHousing #RealEstate #${p.city.replace(/\\s+/g, '')}RealEstate #For${p.listing_type === 'for-rent' ? 'Rent' : 'Sale'} #DreamHome`;
      
    setCaption(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImages = async () => {
    if (!property) return;
    
    // In the detail API, images might be inside `images` array with `image_url` property
    // We also fallback to `initialProperty.image_urls` which comes from list view
    const pDetail = property as any;
    const imagesToDownload = pDetail.images 
      ? pDetail.images.map((img: any) => img.image_url) 
      : (property.image_urls || [property.primary_image_url].filter(Boolean));
      
    if (!imagesToDownload || imagesToDownload.length === 0) {
      alert("No images available to download");
      return;
    }

    setDownloading(true);
    
    for (let i = 0; i < imagesToDownload.length; i++) {
      const url = imagesToDownload[i];
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `${property.slug}-image-${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
        
        // Small delay to prevent browser blocking multiple downloads
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error('Error downloading image', url, err);
        // Fallback: just open in new tab
        window.open(url, '_blank');
      }
    }
    
    setDownloading(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{initialProperty.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Loading property details...</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                Property Images
                <button 
                  className="btn-secondary" 
                  onClick={downloadImages}
                  disabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download All'}
                </button>
              </div>
              <div className={styles.imageGrid}>
                {((property as any)?.images || []).map((img: any, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img.image_url} alt="Property" className={styles.imageThumb} />
                ))}
                {!(property as any)?.images && property?.image_urls?.map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="Property" className={styles.imageThumb} />
                ))}
              </div>
              
              <div className={styles.sectionTitle}>Details</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p><strong>Price:</strong> ${property?.price} {property?.price_label}</p>
                <p><strong>Location:</strong> {property?.address}, {property?.city}, {property?.state}</p>
                <p><strong>Type:</strong> {property?.type} ({property?.listing_type})</p>
                <p><strong>Status:</strong> {property?.status}</p>
              </div>
            </div>
            
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                Social Media Caption
                <button className="btn-primary" onClick={copyToClipboard}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
              <div className={styles.captionBox}>
                <div className={styles.captionText}>{caption}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
