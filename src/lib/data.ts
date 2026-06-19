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

export type ProductGender = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  href: string;
};

export type ProductItem = {
  id: string;
  categoryId: string;
  genderId: string;
  categoryName?: string;
  name: string;
  description: string;
  imageUrl: string;
  addToHome: boolean;
};

export type CategoryDetailItem = {
  photoUrl: string;
  text: string;
};

export type CategoryDetails = {
  thumbnailUrl: string;
  details: CategoryDetailItem[];
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  products: ProductItem[];
  categoryDetails?: CategoryDetails | null;
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


function normalizeContactAddress(item: Record<string, unknown>): ContactAddressItem {
  const mapLocation = String(item.mapLocation || '').trim();
  const fullAddress = String(item.fullAddress || '').trim();

  // ── Embed URL ────────────────────────────────────────────────────────────────
  // Use whatever embed URL was resolved and stored by the API on save (coordinate-based
  // for short links, or address-based fallback). Only recompute from address for records
  // that predate this field.
  const storedEmbedUrl = String(item.mapEmbedUrl || '').trim();
  const addrForEmbed = fullAddress || mapLocation;
  const mapEmbedUrl = storedEmbedUrl
    ? storedEmbedUrl
    : addrForEmbed
    ? `https://maps.google.com/maps?q=${encodeURIComponent(addrForEmbed)}&output=embed`
    : '';

  // ── Direction URL ────────────────────────────────────────────────────────────
  // Never use embed URLs for directions — they open the embed API error page.
  // Use the stored value if it's a real directions/share URL; otherwise rebuild.
  const storedDirectionUrl = String(item.directionUrl || '').trim();
  const isEmbedUrl = (u: string) => u.startsWith('https://www.google.com/maps/embed');
  let directionUrl = isEmbedUrl(storedDirectionUrl) ? '' : storedDirectionUrl;
  if (!directionUrl) {
    if (fullAddress) {
      directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
    } else if (mapLocation && !isEmbedUrl(mapLocation)) {
      directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLocation)}`;
    }
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

export async function getProductGenders(): Promise<ProductGender[]> {
  const db = await getDb();
  const docs = await db
    .collection<Record<string, unknown> & { _id: ObjectId }>('productGenders')
    .find({})
    .sort({ createdAt: 1 })
    .toArray();

  return docs.map((doc) => {
    const name = String(doc.name || '');
    const slug = String(doc.slug || '') || makeSlug(name);
    return {
      id: doc._id.toString(),
      name,
      slug,
      imageUrl: String(doc.imageUrl || ''),
      href: `/products/${slug}`,
    };
  });
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

  const [categoryDocs, categoryDetailsDocs] = await Promise.all([
    db
      .collection<{ _id: ObjectId; name: string }>('productCategories')
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray(),
    db
      .collection<{ _id: ObjectId; categoryId?: string; thumbnailUrl?: string; details?: CategoryDetailItem[] }>('categoryDetails')
      .find({})
      .toArray(),
  ]);

  const detailsMap = new Map(
    categoryDetailsDocs.map((doc) => [
      String(doc.categoryId || ''),
      {
        thumbnailUrl: String(doc.thumbnailUrl || ''),
        details: Array.isArray(doc.details)
          ? doc.details.map((d) => ({ photoUrl: String(d?.photoUrl || ''), text: String(d?.text || '') }))
          : [],
      } as CategoryDetails,
    ])
  );

  const categories = categoryDocs.map((doc) => {
    const id = doc._id.toString();
    return {
      id,
      name: String(doc.name || ''),
      slug: makeSlug(String(doc.name || 'category')),
      products: [] as ProductItem[],
      categoryDetails: detailsMap.get(id) ?? null,
    };
  });

  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const productDocs = await db
    .collection<{
      _id: ObjectId;
      categoryId?: string;
      genderId?: string;
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
      genderId: String(product.genderId || ''),
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
        genderId: String(product.genderId || ''),
        categoryName: 'Uncategorized',
        name: String(product.name || ''),
        description: String(product.description || ''),
        imageUrl: String(product.imageUrl || ''),
        addToHome: Boolean(product.addToHome),
      })),
      categoryDetails: null,
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
