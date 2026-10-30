import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { host, port, dbName, dbUser, dbPassword, sslMode } = body;

    if (!host || !dbName || !dbUser) {
      return NextResponse.json(
        { success: false, error: 'Missing required PostgreSQL configuration fields (Host, Database Name, DB User).' },
        { status: 400 }
      );
    }

    const clientConfig: any = {
      host: String(host).trim(),
      port: Number(port) || 5432,
      database: String(dbName).trim(),
      user: String(dbUser).trim(),
      ssl: sslMode === 'require' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 4000,
    };

    if (typeof dbPassword === 'string' && dbPassword.length > 0) {
      clientConfig.password = dbPassword;
    }

    let client = new Client(clientConfig);

    try {
      await client.connect();
    } catch (connErr: any) {
      if (connErr.code === '3D000' || connErr.message.includes('does not exist')) {
        const rootClientConfig = {
          ...clientConfig,
          database: 'postgres',
        };
        const rootClient = new Client(rootClientConfig);
        await rootClient.connect();

        const safeDbName = String(dbName).replace(/[^a-zA-Z0-9_-]/g, '');
        try {
          await rootClient.query(`CREATE DATABASE "${safeDbName}";`);
        } catch (createErr: any) {
          if (createErr.code !== '42P04' && !createErr.message.includes('already exists')) {
            await rootClient.end();
            throw createErr;
          }
        }
        await rootClient.end();

        client = new Client(clientConfig);
        await client.connect();
      } else {
        throw connErr;
      }
    }

    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS crm_companies (
        id SERIAL PRIMARY KEY,
        company_key VARCHAR(100) UNIQUE,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'USD',
        logo VARCHAR(10),
        custom_logo_url TEXT,
        plan VARCHAR(50) NOT NULL DEFAULT 'Starter',
        db_host VARCHAR(255),
        db_port INTEGER DEFAULT 5432,
        db_name VARCHAR(255),
        db_user VARCHAR(255),
        ssl_mode VARCHAR(50) DEFAULT 'disable',
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_users (
        id SERIAL PRIMARY KEY,
        user_key VARCHAR(100) UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        company_id VARCHAR(100) NOT NULL,
        avatar VARCHAR(50),
        title VARCHAR(100),
        theme_mode VARCHAR(20) DEFAULT 'light',
        color_theme VARCHAR(50) DEFAULT 'default',
        can_install_apps BOOLEAN DEFAULT TRUE,
        can_uninstall_apps BOOLEAN DEFAULT TRUE,
        can_upload_modules BOOLEAN DEFAULT TRUE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_installed_apps (
        id SERIAL PRIMARY KEY,
        app_id VARCHAR(100) NOT NULL,
        company_id VARCHAR(100) NOT NULL,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_theme_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        company_id VARCHAR(100) NOT NULL,
        theme_mode VARCHAR(20) DEFAULT 'light',
        color_theme VARCHAR(50) DEFAULT 'default',
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_leads (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        value NUMERIC(12,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'new',
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_deals (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        stage VARCHAR(50) DEFAULT 'prospect',
        amount NUMERIC(12,2) DEFAULT 0,
        closing_date DATE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_contacts (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        company_name VARCHAR(255),
        phone VARCHAR(50),
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_invoices (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        invoice_number VARCHAR(100) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        amount NUMERIC(12,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'unpaid',
        due_date DATE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_calendar_events (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        attendees TEXT,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS crm_website_cms (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        page_title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        content TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    ];

    for (const queryStr of tableQueries) {
      await client.query(queryStr);
    }

    const res = await client.query('SELECT NOW() as current_time, version();');
    await client.end();

    return NextResponse.json({
      success: true,
      message: `Real PostgreSQL Database "${dbName}" Connected & All crm_ Tables Created Successfully!`,
      details: {
        serverTime: res.rows[0].current_time,
        version: res.rows[0].version,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to connect to real PostgreSQL database instance.',
      },
      { status: 500 }
    );
  }
}
