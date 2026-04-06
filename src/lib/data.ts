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

export type SisterConcernItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  link: string;
};

export type ProductItem = {
  id: string;
  name: string;
  imageUrl: string;
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

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  link: string;
};

export async function getHomepage() {
  const db = await getDb();
  const doc = await db
    .collection<HomepageData & { _id: string }>('homepage')
    .findOne({ _id: 'homepage' });
  return doc ? doc : null;
}

export async function getSisterConcerns() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<SisterConcernItem, 'id'> & { _id: ObjectId }>('sisterConcerns')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  return docs.map(mapId);
}

export async function getProducts() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<ProductItem, 'id'> & { _id: ObjectId }>('products')
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  return docs.map(mapId);
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

export async function getNews() {
  const db = await getDb();
  const docs = await db
    .collection<Omit<NewsItem, 'id'> & { _id: ObjectId }>('news')
    .find({})
    .sort({ date: -1, createdAt: -1 })
    .toArray();
  return docs.map(mapId);
}
