import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const { username, password, host, port, database } = await req.json();

    const connection = await mysql.createConnection({
      host,
      port: parseInt(port, 10),
      user: username,
      password,
      database,
    });

    const [rows] = await connection.execute('SHOW TABLES');
    const tables = rows.map(row => Object.values(row)[0]);

    await connection.end();

    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
  }
}