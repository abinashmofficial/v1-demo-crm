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
    const companyId = url.searchParams.get('companyId');

    const clientConfig: any = {
      host: host.trim(),
      port,
      database: dbName.trim(),
      user: dbUser.trim(),
      connectionTimeoutMillis: 4000,
    };
    if (dbPassword) clientConfig.password = dbPassword;

    let client = new Client(clientConfig);
    try {
      await client.connect();
    } catch (connErr: any) {
      if (connErr.code === '3D000' || connErr.message.includes('does not exist')) {
        const rootClient = new Client({
          ...clientConfig,
          database: 'postgres',
        });
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_users (
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
      );
    `);

    let query = `SELECT id, user_key, name, email, role, company_id, avatar, title, can_install_apps, can_uninstall_apps, can_upload_modules, active_status FROM crm_users WHERE active_status = TRUE`;
    const params: any[] = [];
    if (companyId) {
      query += ` AND (company_id = $1 OR role = 'admin')`;
      params.push(companyId);
    }
    query += ` ORDER BY id ASC;`;

    const res = await client.query(query, params);
    await client.end();

    const users = res.rows.map((u: any) => ({
      id: u.user_key || String(u.id),
      name: u.name,
      email: u.email,
      role: u.role,
      companyId: u.company_id,
      avatar: u.avatar || u.name[0],
      title: u.title || 'User',
      permissions: {
        canInstallApps: Boolean(u.can_install_apps),
        canUninstallApps: Boolean(u.can_uninstall_apps),
        canUploadModules: Boolean(u.can_upload_modules),
      },
    }));

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, dbConfig } = body;

    if (!user || !user.email || !user.name) {
      return NextResponse.json({ success: false, error: 'User name and email are required.' }, { status: 400 });
    }

    const host = dbConfig?.host || 'localhost';
    const port = Number(dbConfig?.port) || 5432;
    const dbName = dbConfig?.dbName || 'pro-lms';
    const dbUser = dbConfig?.dbUser || 'postgres';
    const dbPassword = dbConfig?.dbPassword || '';

    const clientConfig: any = {
      host: host.trim(),
      port,
      database: dbName.trim(),
      user: dbUser.trim(),
      connectionTimeoutMillis: 4000,
    };
    if (dbPassword) clientConfig.password = dbPassword;

    let client = new Client(clientConfig);
    try {
      await client.connect();
    } catch (connErr: any) {
      if (connErr.code === '3D000' || connErr.message.includes('does not exist')) {
        const rootClient = new Client({
          ...clientConfig,
          database: 'postgres',
        });
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_users (
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
      );
    `);

    const userKey = user.id || 'usr-' + Date.now();
    const rawPassword = user.password || '123456';
    const hashedPassword = require('crypto').createHash('sha256').update(rawPassword).digest('hex');

    await client.query(
      `INSERT INTO crm_users (user_key, name, email, password, role, company_id, avatar, title, can_install_apps, can_uninstall_apps, can_upload_modules, active_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password = CASE WHEN EXCLUDED.password IS NOT NULL AND EXCLUDED.password != '' THEN EXCLUDED.password ELSE crm_users.password END,
         role = EXCLUDED.role,
         company_id = EXCLUDED.company_id,
         title = EXCLUDED.title,
         can_install_apps = EXCLUDED.can_install_apps,
         can_uninstall_apps = EXCLUDED.can_uninstall_apps,
         can_upload_modules = EXCLUDED.can_upload_modules;`,
      [
        userKey,
        user.name,
        user.email,
        hashedPassword,
        user.role || 'user',
        user.companyId || 'cmp-1',
        user.avatar || user.name[0],
        user.title || 'Team Member',
        Boolean(user.permissions?.canInstallApps ?? true),
        Boolean(user.permissions?.canUninstallApps ?? true),
        Boolean(user.permissions?.canUploadModules ?? true),
      ]
    );

    await client.end();
    return NextResponse.json({ success: true, message: 'User persisted successfully in PostgreSQL database.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
