interface CategoryInfo {
  category: string;
  subcategory: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  'amenity=restaurant': { category: 'Food & Drink', subcategory: 'Restaurant' },
  'amenity=cafe': { category: 'Food & Drink', subcategory: 'Cafe' },
  'amenity=bar': { category: 'Food & Drink', subcategory: 'Bar' },
  'amenity=pub': { category: 'Food & Drink', subcategory: 'Pub' },
  'amenity=fast_food': { category: 'Food & Drink', subcategory: 'Fast Food' },
  'amenity=ice_cream': { category: 'Food & Drink', subcategory: 'Ice Cream' },
  'amenity=food_court': { category: 'Food & Drink', subcategory: 'Food Court' },
  'amenity=pharmacy': { category: 'Health & Medical', subcategory: 'Pharmacy' },
  'amenity=clinic': { category: 'Health & Medical', subcategory: 'Clinic' },
  'amenity=dentist': { category: 'Health & Medical', subcategory: 'Dentist' },
  'amenity=doctors': { category: 'Health & Medical', subcategory: 'Doctor' },
  'amenity=hospital': { category: 'Health & Medical', subcategory: 'Hospital' },
  'amenity=veterinary': { category: 'Health & Medical', subcategory: 'Veterinary' },
  'amenity=bank': { category: 'Services', subcategory: 'Bank' },
  'amenity=atm': { category: 'Services', subcategory: 'ATM' },
  'amenity=post_office': { category: 'Services', subcategory: 'Post Office' },
  'amenity=library': { category: 'Entertainment', subcategory: 'Library' },
  'amenity=cinema': { category: 'Entertainment', subcategory: 'Cinema' },
  'amenity=theatre': { category: 'Entertainment', subcategory: 'Theatre' },
  'amenity=nightclub': { category: 'Entertainment', subcategory: 'Nightclub' },
  'amenity=arts_centre': { category: 'Entertainment', subcategory: 'Arts Centre' },
  'amenity=community_centre': { category: 'Services', subcategory: 'Community Centre' },
  'amenity=gym': { category: 'Fitness', subcategory: 'Gym' },
  'amenity=studio': { category: 'Services', subcategory: 'Studio' },
  'amenity=marketplace': { category: 'Shopping', subcategory: 'Marketplace' },
  'shop=supermarket': { category: 'Shopping', subcategory: 'Supermarket' },
  'shop=convenience': { category: 'Shopping', subcategory: 'Convenience Store' },
  'shop=clothes': { category: 'Shopping', subcategory: 'Clothing' },
  'shop=bakery': { category: 'Food & Drink', subcategory: 'Bakery' },
  'shop=butcher': { category: 'Food & Drink', subcategory: 'Butcher' },
  'shop=deli': { category: 'Food & Drink', subcategory: 'Deli' },
  'shop=hairdresser': { category: 'Services', subcategory: 'Hairdresser' },
  'shop=beauty': { category: 'Services', subcategory: 'Beauty' },
  'shop=hardware': { category: 'Shopping', subcategory: 'Hardware Store' },
  'shop=electronics': { category: 'Shopping', subcategory: 'Electronics' },
  'shop=books': { category: 'Shopping', subcategory: 'Bookstore' },
  'shop=florist': { category: 'Shopping', subcategory: 'Florist' },
  'shop=pet': { category: 'Shopping', subcategory: 'Pet Store' },
  'shop=alcohol': { category: 'Shopping', subcategory: 'Liquor Store' },
  'shop=tobacco': { category: 'Shopping', subcategory: 'Tobacco Shop' },
  'shop=jewelry': { category: 'Shopping', subcategory: 'Jewelry' },
  'shop=optician': { category: 'Health & Medical', subcategory: 'Optician' },
  'shop=laundry': { category: 'Services', subcategory: 'Laundry' },
  'shop=dry_cleaning': { category: 'Services', subcategory: 'Dry Cleaning' },
  'tourism=hotel': { category: 'Tourism', subcategory: 'Hotel' },
  'tourism=museum': { category: 'Entertainment', subcategory: 'Museum' },
  'tourism=gallery': { category: 'Entertainment', subcategory: 'Gallery' },
  'tourism=attraction': { category: 'Entertainment', subcategory: 'Attraction' },
  'leisure=fitness_centre': { category: 'Fitness', subcategory: 'Fitness Centre' },
  'leisure=sports_centre': { category: 'Fitness', subcategory: 'Sports Centre' },
  'leisure=swimming_pool': { category: 'Fitness', subcategory: 'Swimming Pool' },
  'leisure=bowling_alley': { category: 'Entertainment', subcategory: 'Bowling' },
  'leisure=dance': { category: 'Entertainment', subcategory: 'Dance' },
};

function capitalize(s: string): string {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function categorize(tags: Record<string, string>): CategoryInfo {
  for (const [tagExpr, result] of Object.entries(CATEGORY_MAP)) {
    const [key, value] = tagExpr.split('=');
    if (tags[key] === value) return result;
  }
  if (tags.shop) return { category: 'Shopping', subcategory: capitalize(tags.shop) };
  if (tags.amenity) return { category: 'Services', subcategory: capitalize(tags.amenity) };
  if (tags.tourism) return { category: 'Tourism', subcategory: capitalize(tags.tourism) };
  if (tags.leisure) return { category: 'Leisure', subcategory: capitalize(tags.leisure) };
  if (tags.craft) return { category: 'Crafts', subcategory: capitalize(tags.craft) };
  return { category: 'Other', subcategory: 'Business' };
}

export function getDisplayName(name: string | null, subcategory: string): string {
  return name || `Unnamed ${subcategory}`;
}
