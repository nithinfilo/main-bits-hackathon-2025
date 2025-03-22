import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(req) {
  try {
    const { uri, database } = await req.json();

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(database);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    await client.close();

    return NextResponse.json({ collections: collectionNames });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
  }
}