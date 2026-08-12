export interface Property {
  id: number;
  slug: string;
  title: string;
  type: string;
  listing_type: string;
  status: string;
  price: string;
  price_label: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  primary_image_url: string | null;
  image_urls: string[];
  description?: string; // Detail only
  amenities?: { id: number; name: string }[]; // Detail only
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Use relative path in browser for proxy
  return process.env.NEXT_PUBLIC_API_URL || 'https://admin.primefamilyhousing.com';
};

export async function searchProperties(query: string = ''): Promise<Property[]> {
  try {
    const baseUrl = getBaseUrl();
    const queryStr = query ? `?q=${encodeURIComponent(query)}` : '';
    const url = `${baseUrl}/api/v1/properties/${queryStr}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // The API might return paginated data (e.g. { results: [...] }) or a direct array.
    // Based on standard DRF, it's likely { count, next, previous, results: Property[] }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getPropertyDetail(slug: string): Promise<Property | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/properties/${slug}/`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}
