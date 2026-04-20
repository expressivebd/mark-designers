import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

function mapId<T extends { _id: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
}

export type HomepageData = {
  hero: {
    videoUrl: string;
    headlines: string[];
    subheadline: string;
  };
  about: {
    text: string;
    stats: Array<{ label: string; number: number; suffix: string }>;
  };
  sustainability: Array<{
    title: string;
    imageUrl: string;
    description: string;
    link: string;
  }>;
};

export type AboutFacilityItem = {
  name: string;
  imageUrl: string;
};

export type AboutExpertiseItem = {
  name: string;
  details: string;
  imageUrl: string;
};

export type AboutPageData = {
  journey: string;
  stats: Array<{ label: string; number: number; suffix: string }>;
  facilities: AboutFacilityItem[];
  expertise: AboutExpertiseItem[];
};

export type SisterConcernItem = {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  thumbnailUrl: string;
  description: string;
  link: string;
  establishedYear: string;
  location: string;
  capacity: string;
  personnel: string;
  yearsInOperation: number;
  totalMachines: string;
  factoryPhotos: string[];
};

function normalizeSisterConcern(item: Record<string, unknown>): SisterConcernItem {
  const id = String(item.id || '');
  const name = String(item.name || '');
  const slug = String(item.slug || '') || name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const thumbnailUrl = String(item.thumbnailUrl || item.imageUrl || '');
  const establishedYear = String(item.establishedYear || '');
  const currentYear = new Date().getFullYear();
  const yearsFromYear = establishedYear ? currentYear - Number(establishedYear) : 0;
  const yearsInOperation = Number(item.yearsInOperation || yearsFromYear || 0);

  return {
    id,
    name,
    tagline: String(item.tagline || item.shortDescription || item.description || ''),
    slug,
    thumbnailUrl,
    description: String(item.description || ''),
    link: String(item.link || `/sister-concerns/${slug}`),
    establishedYear,
    location: String(item.location || ''),
    capacity: String(item.capacity || ''),
    personnel: String(item.personnel || ''),
    yearsInOperation: Number.isFinite(yearsInOperation) ? yearsInOperation : 0,
    totalMachines: String(item.totalMachines || ''),
    factoryPhotos: Array.isArray(item.factoryPhotos)
      ? item.factoryPhotos.filter((photo): photo is string => typeof photo === 'string')
      : [],
  };
}

export type ProductItem = {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  imageUrl: string;
  addToHome: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  products: ProductItem[];
};

export type CertificationItem = {
  id: string;
  name: string;
  logoUrl: string;
};

export type ClientItem = {
  id: string;
  name: string;
  logoUrl: string;
};

export type ClientStats = {
  totalClients: number;
  countriesServed: string;
  yearsServed: string;
  satisfactionPercentage: string;
};

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  link: string;
};

export type ContactAddressItem = {
  id: string;
  title: string;
  fullAddress: string;
  phones: string[];
  emails: string[];
  mapLocation: string;
  mapEmbedUrl: string;
  directionUrl: string;
};

function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl' ||
      url.hostname === 'www.google.com' && url.pathname.startsWith('/maps') ||
      url.hostname === 'google.com' && url.pathname.startsWith('/maps')
    );
  } catch {
    return false;
  }
}

function buildEmbedUrlFromMapsUrl(mapsUrl: string): string {
  try {
    const url = new URL(mapsUrl);
    // Already an embed URL — return as-is
    if (url.searchParams.get('output') === 'embed') return mapsUrl;
    // short link like maps.app.goo.gl — append output=embed as query param
    if (url.hostname === 'maps.app.goo.gl' || url.hostname === 'goo.gl') {
      return `${mapsUrl}${mapsUrl.includes('?') ? '&' : '?'}output=embed`;
    }
    // Full google.com/maps URL
    if ((url.hostname === 'www.google.com' || url.hostname === 'google.com') && url.pathname.startsWith('/maps')) {
      url.searchParams.set('output', 'embed');
      return url.toString();
    }
  } catch {
    // fall through
  }
  return '';
}

function normalizeContactAddress(item: Record<string, unknown>): ContactAddressItem {
  const mapLocation = String(item.mapLocation || '').trim();
  const fullAddress = String(item.fullAddress || '').trim();

  // ── Embed URL ────────────────────────────────────────────────────────────────
  // Always geocode from plain-text fullAddress. This is 100% reliable and works
  // for any address. We NEVER trust stored URLs because old records contain the
  // short link URL-encoded as the `q` parameter (completely broken).
  const addrForEmbed = fullAddress || mapLocation;
  const mapEmbedUrl =
    addrForEmbed && !isGoogleMapsUrl(addrForEmbed)
      ? `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed`
      : addrForEmbed
      ? `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed`
      : '';

  // ── Direction URL ────────────────────────────────────────────────────────────
  // If mapLocation is a real Google Maps share link, use it directly — browsers
  // follow the redirect correctly when the link is opened in a new tab.
  // Otherwise derive from fullAddress.
  let directionUrl = '';
  if (mapLocation && isGoogleMapsUrl(mapLocation)) {
    directionUrl = mapLocation;
  } else if (fullAddress) {
    directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  } else if (mapLocation) {
    directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLocation)}`;
  }

  return {
    id: String(item.id || ''),
    title: String(item.title || ''),
    fullAddress,
    phones: Array.isArray(item.phones)
      ? item.phones.filter((phone): phone is string => typeof phone === 'string' && phone.trim().length > 0)
      : [],
    emails: Array.isArray(item.emails)
      ? item.emails.filter((email): email is string => typeof email === 'string' && email.trim().length > 0)
      : [],
    mapLocation,
    mapEmbedUrl,
    directionUrl,
  };
}


export async function getHomepage() {
  const db = await getDb();
  const doc = await db
    .collection<HomepageData & { _id: string }>('homepage')
    .findOne({ _id: 'homepage' });
  return doc ? doc : null;
}

export async function getAboutPage() {
  const db = await getDb();
  const doc = await db
    .collection<AboutPageData & { _id: string }>('aboutPage')
    .findOne({ _id: 'about' });
  return doc ? doc : null;
}

export async function getSisterConcerns() {
  const db = await getDb();
  const docs = await db
    .collection<Record<string, unknown> & { _id: ObjectId }>('sisterConcerns')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  return docs.map((doc) => normalizeSisterConcern(mapId(doc) as Record<string, unknown>));
}

export async function getSisterConcernBySlug(slug: string) {
  const db = await getDb();
  const doc = await db
    .collection<Record<string, unknown> & { _id: ObjectId }>('sisterConcerns')
    .findOne({ $or: [{ slug }, { link: `/sister-concerns/${slug}` }] });

  if (!doc) {
    return null;
  }

  return normalizeSisterConcern(mapId(doc) as Record<string, unknown>);
}

export async function getProducts() {
  const categories = await getProductCategories();
  return categories.flatMap((category) => category.products);
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getProductCategories() {
  const db = await getDb();
  const categoryDocs = await db
    .collection<{ _id: ObjectId; name: string }>('productCategories')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();

  const categories = categoryDocs.map((doc) => ({
    id: doc._id.toString(),
    name: String(doc.name || ''),
    slug: makeSlug(String(doc.name || 'category')),
    products: [] as ProductItem[],
  }));

  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const productDocs = await db
    .collection<{
      _id: ObjectId;
      categoryId?: string;
      name?: string;
      description?: string;
      imageUrl?: string;
      addToHome?: boolean;
    }>('products')
    .find({})
    .sort({ createdAt: 1 })
    .toArray();

  for (const product of productDocs) {
    const categoryId = String(product.categoryId || '');
    const category = categoryMap.get(categoryId);

    if (!category) {
      continue;
    }

    category.products.push({
      id: product._id.toString(),
      categoryId,
      categoryName: category.name,
      name: String(product.name || ''),
      description: String(product.description || ''),
      imageUrl: String(product.imageUrl || ''),
      addToHome: Boolean(product.addToHome),
    });
  }

  const uncategorized = productDocs.filter((product) => {
    const categoryId = String(product.categoryId || '');
    return !categoryMap.has(categoryId);
  });

  if (uncategorized.length > 0) {
    categories.push({
      id: 'uncategorized',
      name: 'Uncategorized',
      slug: 'uncategorized',
      products: uncategorized.map((product) => ({
        id: product._id.toString(),
        categoryId: 'uncategorized',
        categoryName: 'Uncategorized',
        name: String(product.name || ''),
        description: String(product.description || ''),
        imageUrl: String(product.imageUrl || ''),
        addToHome: Boolean(product.addToHome),
      })),
    });
  }

  return categories;
}

export async function getHomeProducts() {
  const products = await getProducts();
  return products.filter((product) => product.addToHome);
}

export async function getCertifications() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<CertificationItem, 'id'> & { _id: ObjectId }>('certifications')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  return docs.map(mapId);
}

export async function getClients() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<ClientItem, 'id'> & { _id: ObjectId }>('clients')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  return docs.map(mapId);
}

export async function getClientStats(): Promise<ClientStats> {
  const db = await getDb();

  const [clients, statsDoc] = await Promise.all([
    db.collection<Omit<ClientItem, 'id'> & { _id: ObjectId }>('clients').countDocuments({}),
    db.collection<{
      _id: string;
      countriesServed?: string;
      yearsServed?: string;
      satisfactionPercentage?: string;
    }>('settings').findOne({ _id: 'clientStats' }),
  ]);

  return {
    totalClients: clients,
    countriesServed: String(statsDoc?.countriesServed || ''),
    yearsServed: String(statsDoc?.yearsServed || ''),
    satisfactionPercentage: String(statsDoc?.satisfactionPercentage || ''),
  };
}

export async function getNews() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<NewsItem, 'id'> & { _id: ObjectId }>('news')
    .find({})
    .sort({ date: -1, createdAt: -1 })
    .toArray();
  return docs.map(mapId);
}

export async function getContactAddresses() {
  const db = await getDb();
  const docs = await db
    .collection<Record<string, unknown> & { _id: ObjectId }>('contactAddresses')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();

  return docs.map((doc) => normalizeContactAddress(mapId(doc) as Record<string, unknown>));
}
