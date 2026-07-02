/*
 * ============================================================
 *  MOCK LISTINGS, placeholder until Vault RE API is wired up.
 *
 *  Images: placeholder service (placehold.co / picsum), clearly
 *  labelled. When Vault RE is connected, this file is replaced
 *  by the live Vault RE API response shape.
 *
 *  TO SWAP TO REAL LISTINGS:
 *    Replace this file's export with a call to src/lib/api.ts
 *    once Akshay's Vault RE API key is in place.
 * ============================================================
 */

export interface Listing {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;         // display string e.g. "$780,000"
  bedrooms: number;
  bathrooms: number;
  parking: number;
  propertyType: string;
  status: "For Sale" | "Sold" | "Under Offer";
  imageUrl: string;
  isPlaceholder: true;   // flag, remove when real data arrives
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-001",
    address: "12 Waverly Crescent",
    suburb: "Brighton",
    state: "VIC",
    postcode: "3186",
    price: "$1,250,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    propertyType: "Townhouse",
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/manifest01/800/600",
    isPlaceholder: true,
  },
  {
    id: "mock-002",
    address: "7/45 Station Street",
    suburb: "Hawthorn",
    state: "VIC",
    postcode: "3122",
    price: "$620,000",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    propertyType: "Apartment",
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/manifest02/800/600",
    isPlaceholder: true,
  },
  {
    id: "mock-003",
    address: "88 Ormond Esplanade",
    suburb: "Elwood",
    state: "VIC",
    postcode: "3184",
    price: "$2,100,000",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    propertyType: "House",
    status: "Under Offer",
    imageUrl: "https://picsum.photos/seed/manifest03/800/600",
    isPlaceholder: true,
  },
  {
    id: "mock-004",
    address: "23 Chapel Lane",
    suburb: "South Yarra",
    state: "VIC",
    postcode: "3141",
    price: "$780,000",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    propertyType: "Apartment",
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/manifest04/800/600",
    isPlaceholder: true,
  },
  {
    id: "mock-005",
    address: "5 Bayside Boulevard",
    suburb: "Port Melbourne",
    state: "VIC",
    postcode: "3207",
    price: "$1,450,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    propertyType: "Townhouse",
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/manifest05/800/600",
    isPlaceholder: true,
  },
  {
    id: "mock-006",
    address: "11 Claremont Road",
    suburb: "Malvern East",
    state: "VIC",
    postcode: "3145",
    price: "$1,850,000",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    propertyType: "House",
    status: "Sold",
    imageUrl: "https://picsum.photos/seed/manifest06/800/600",
    isPlaceholder: true,
  },
];
