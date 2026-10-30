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

    // Auto-create crm_leads if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_leads (
        id SERIAL PRIMARY KEY,
        lead_key VARCHAR(100) UNIQUE,
        company_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'New',
        source VARCHAR(50) DEFAULT 'Website',
        ai_score INT DEFAULT 80,
        deal_value NUMERIC(12, 2) DEFAULT 0,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);



    const res = await client.query(`SELECT * FROM crm_leads ORDER BY id DESC;`);
    await client.end();

    const leads = res.rows.map((r: any) => ({
      id: r.lead_key || String(r.id),
      companyId: r.company_id,
      name: r.name,
      company: r.company,
      email: r.email,
      phone: r.phone,
      status: r.status,
      source: r.source,
      aiScore: r.ai_score,
      dealValue: Number(r.deal_value),
      tags: r.tags || [],
      createdAt: r.created_at,
    }));

    return NextResponse.json({ success: true, leads });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
