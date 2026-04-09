import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';

type CategoryDoc = {
  _id: ObjectId;
  name?: string;
  createdAt?: Date;
};

type ProductDoc = {
  _id: ObjectId;
  categoryId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  addToHome?: boolean;
  createdAt?: Date;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toCategoriesWithProducts(categories: CategoryDoc[], products: ProductDoc[]) {
  const mappedCategories = categories.map((category) => ({
    id: category._id.toString(),
    name: String(category.name || ''),
    slug: slugify(String(category.name || 'category')),
    products: [] as Array<{
      id: string;
      categoryId: string;
      name: string;
      description: string;
      imageUrl: string;
      addToHome: boolean;
    }>,
  }));

  const categoryMap = new Map(mappedCategories.map((category) => [category.id, category]));

  for (const product of products) {
    const categoryId = String(product.categoryId || '');
    const category = categoryMap.get(categoryId);
    if (!category) {
      continue;
    }

    category.products.push({
      id: product._id.toString(),
      categoryId,
      name: String(product.name || ''),
      description: String(product.description || ''),
      imageUrl: String(product.imageUrl || ''),
      addToHome: Boolean(product.addToHome),
    });
  }

  const uncategorized = products.filter((product) => {
    const categoryId = String(product.categoryId || '');
    return !categoryMap.has(categoryId);
  });

  if (uncategorized.length > 0) {
    mappedCategories.push({
      id: 'uncategorized',
      name: 'Uncategorized',
      slug: 'uncategorized',
      products: uncategorized.map((product) => ({
        id: product._id.toString(),
        categoryId: 'uncategorized',
        name: String(product.name || ''),
        description: String(product.description || ''),
        imageUrl: String(product.imageUrl || ''),
        addToHome: Boolean(product.addToHome),
      })),
    });
  }

  return mappedCategories;
}

function parseObjectId(value: unknown) {
  if (typeof value !== 'string' || !ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const [categories, products] = await Promise.all([
    db.collection<CategoryDoc>('productCategories').find({}).sort({ order: 1, createdAt: 1 }).toArray(),
    db.collection<ProductDoc>('products').find({}).sort({ order: 1, createdAt: 1 }).toArray(),
  ]);

  return NextResponse.json(toCategoriesWithProducts(categories, products));
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const db = await getDb();

  if (payload?.action === 'createCategory') {
    const name = String(payload?.name || '').trim();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const result = await db.collection('productCategories').insertOne({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId.toString(), name });
  }

  if (payload?.action === 'createProduct') {
    const categoryId = parseObjectId(payload?.categoryId);
    if (!categoryId) {
      return NextResponse.json({ error: 'Valid category ID is required' }, { status: 400 });
    }

    const name = String(payload?.name || '').trim();
    const description = String(payload?.description || '').trim();
    const imageUrl = String(payload?.imageUrl || '').trim();

    if (!name || !description || !imageUrl) {
      return NextResponse.json({ error: 'Name, description and image are required' }, { status: 400 });
    }

    const result = await db.collection('products').insertOne({
      categoryId: categoryId.toString(),
      name,
      description,
      imageUrl,
      addToHome: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId.toString() });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const productId = parseObjectId(payload?.id);
  if (!productId) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const db = await getDb();

  if (payload?.action === 'toggleHome') {
    await db.collection('products').updateOne(
      { _id: productId },
      {
        $set: {
          addToHome: Boolean(payload?.addToHome),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true });
  }

  const name = String(payload?.name || '').trim();
  const description = String(payload?.description || '').trim();
  const imageUrl = String(payload?.imageUrl || '').trim();
  const categoryId = parseObjectId(payload?.categoryId);

  if (!name || !description || !imageUrl || !categoryId) {
    return NextResponse.json(
      { error: 'Name, description, image and category are required' },
      { status: 400 }
    );
  }

  await db.collection('products').updateOne(
    { _id: productId },
    {
      $set: {
        categoryId: categoryId.toString(),
        name,
        description,
        imageUrl,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const db = await getDb();

  if (payload?.action === 'deleteCategory') {
    const categoryId = parseObjectId(payload?.id);
    if (!categoryId) {
      return NextResponse.json({ error: 'Valid category ID is required' }, { status: 400 });
    }

    await Promise.all([
      db.collection('productCategories').deleteOne({ _id: categoryId }),
      db.collection('products').deleteMany({ categoryId: categoryId.toString() }),
    ]);

    return NextResponse.json({ ok: true });
  }

  const productId = parseObjectId(payload?.id);
  if (!productId) {
    return NextResponse.json({ error: 'Valid product ID is required' }, { status: 400 });
  }

  await db.collection('products').deleteOne({ _id: productId });
  return NextResponse.json({ ok: true });
}
