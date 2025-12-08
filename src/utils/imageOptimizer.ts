/**
 * Optimize images using weserv.nl proxy (both external and local)
 * @param imageUrl - Original image URL (can be local path or external URL)
 * @param options - Optimization options
 * @param origin - Site origin URL (required for local images)
 * @returns Optimized image URL via weserv.nl
 */
export function optimizeImage(
  imageUrl: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number; // 1-100
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'cover' | 'contain' | 'fill';
  } = {},
  origin?: string
): string | null {
  if (!imageUrl) return null;

  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover'
  } = options;

  // Convert local path to full URL for weserv.nl
  let fullImageUrl: string;
  if (imageUrl.startsWith('/')) {
    // Local image - need origin to create full URL
    if (!origin) {
      // If no origin provided, return as-is (fallback)
      return imageUrl;
    }
    fullImageUrl = `${origin}${imageUrl}`;
  } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // External image - use as-is
    fullImageUrl = imageUrl;
  } else {
    // Invalid URL format
    return imageUrl;
  }

  // Build weserv.nl URL
  const params = new URLSearchParams();
  params.set('url', fullImageUrl);
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('output', format);
  if (fit) params.set('fit', fit);

  // Enable smart crop and auto format
  params.set('we', ''); // Enable smart cropping
  params.set('af', ''); // Auto format (WebP when supported)

  return `https://images.weserv.nl/?${params.toString()}`;
}

/**
 * Optimize player photo
 */
export function optimizePlayerPhoto(photoUrl: string | null | undefined, size: 'tiny' | 'small' | 'card' | 'medium' | 'large' = 'medium', origin?: string): string | null {
  const sizes = {
    tiny: { width: 80, height: 80, quality: 80 }, // For small thumbnails (40x40 display with 2x retina)
    small: { width: 200, height: 300, quality: 80 },
    card: { width: 400, height: 500, quality: 75 }, // For player cards (400x480 display, 2x retina = 400x500)
    medium: { width: 400, height: 600, quality: 80 },
    large: { width: 600, height: 900, quality: 85 }
  };

  const sizeConfig = sizes[size] || sizes.medium;

  return optimizeImage(photoUrl, {
    width: sizeConfig.width,
    height: sizeConfig.height,
    quality: sizeConfig.quality,
    format: 'webp',
    fit: 'cover'
  }, origin);
}

/**
 * Optimize team logo
 */
export function optimizeTeamLogo(logoUrl: string | null | undefined, size: number = 64): string | null {
  return optimizeImage(logoUrl, {
    width: size * 2, // 2x for retina displays
    height: size * 2,
    quality: 90,
    format: 'webp',
    fit: 'contain'
  });
}

