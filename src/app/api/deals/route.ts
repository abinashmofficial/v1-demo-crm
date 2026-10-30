import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const host = url.searchParams.get('host') || 'localhost';
    const port = Number(url.searchParams.get('port')) || 5432;
    const dbName = url.searchParams.get('dbName') || 'pro-lms';
    const dbUser = url.searchParams.get('dbUser') || 'postgres';
    const dbPassword = url.searchParams.get('dbPassword') || '';

    const clientConfig: any = {
      host: host.trim(),
      port,
      database: dbName.trim(),
      user: dbUser.trim(),
      connectionTimeoutMillis: 4000,
    };
    if (dbPassword) clientConfig.password = dbPassword;

    const client = new Client(clientConfig);
    await client.connect();

    // Auto-create crm_deals if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_deals (
        id SERIAL PRIMARY KEY,
        deal_key VARCHAR(100) UNIQUE,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        amount NUMERIC(12, 2) DEFAULT 0,
        stage VARCHAR(50) DEFAULT 'Discovery',
        probability INT DEFAULT 50,
        close_date VARCHAR(50),
        owner VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);



    const res = await client.query(`SELECT * FROM crm_deals ORDER BY id DESC;`);
    await client.end();

    const deals = res.rows.map((r: any) => ({
      id: r.deal_key || String(r.id),
      companyId: r.company_id,
      title: r.title,
      company: r.company,
      amount: Number(r.amount),
      stage: r.stage,
      probability: r.probability,
      closeDate: r.close_date,
      owner: r.owner,
    }));

    return NextResponse.json({ success: true, deals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
