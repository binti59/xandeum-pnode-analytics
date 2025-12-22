import geoip from "geoip-lite";

export interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  flag: string;
}

const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  CA: "🇨🇦",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  NL: "🇳🇱",
  RO: "🇷🇴",
  LT: "🇱🇹",
  NZ: "🇳🇿",
  AU: "🇦🇺",
  JP: "🇯🇵",
  SG: "🇸🇬",
  IN: "🇮🇳",
  BR: "🇧🇷",
  RU: "🇷🇺",
  CN: "🇨🇳",
  KR: "🇰🇷",
  ES: "🇪🇸",
  IT: "🇮🇹",
  SE: "🇸🇪",
  NO: "🇳🇴",
  FI: "🇫🇮",
  DK: "🇩🇰",
  PL: "🇵🇱",
  UA: "🇺🇦",
  TR: "🇹🇷",
  IL: "🇮🇱",
  AE: "🇦🇪",
  SA: "🇸🇦",
  ZA: "🇿🇦",
  MX: "🇲🇽",
  AR: "🇦🇷",
  CL: "🇨🇱",
  CO: "🇨🇴",
  PE: "🇵🇪",
  VE: "🇻🇪",
  TH: "🇹🇭",
  VN: "🇻🇳",
  ID: "🇮🇩",
  MY: "🇲🇾",
  PH: "🇵🇭",
  HK: "🇭🇰",
  TW: "🇹🇼",
  AT: "🇦🇹",
  BE: "🇧🇪",
  CH: "🇨🇭",
  CZ: "🇨🇿",
  GR: "🇬🇷",
  HU: "🇭🇺",
  IE: "🇮🇪",
  PT: "🇵🇹",
  BG: "🇧🇬",
  HR: "🇭🇷",
  EE: "🇪🇪",
  LV: "🇱🇻",
  SK: "🇸🇰",
  SI: "🇸🇮",
};

/**
 * Get country flag emoji from country code
 */
function getCountryFlag(countryCode: string): string {
  return countryFlags[countryCode] || "🌐";
}

/**
 * Lookup geographic information for an IP address
 */
export function lookupGeo(ip: string): GeoLocation | null {
  try {
    const geo = geoip.lookup(ip);
    
    if (!geo) {
      return null;
    }

    return {
      country: geo.country,
      countryCode: geo.country,
      city: geo.city || "Unknown",
      flag: getCountryFlag(geo.country),
    };
  } catch (error) {
    console.error(`Failed to lookup geo for IP ${ip}:`, error);
    return null;
  }
}

/**
 * Extract IP address from address string (format: "IP:PORT")
 */
export function extractIP(address: string): string {
  return address.split(":")[0] || address;
}
