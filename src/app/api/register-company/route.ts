import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, adminUser, dbConfig, selectedApps, mailConfig } = body;

    if (!dbConfig || !dbConfig.host || !dbConfig.dbName || !dbConfig.dbUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid database configuration provided.' },
        { status: 400 }
      );
    }

    const clientConfig: any = {
      host: String(dbConfig.host).trim(),
      port: Number(dbConfig.port) || 5432,
      database: String(dbConfig.dbName).trim(),
      user: String(dbConfig.dbUser).trim(),
      ssl: dbConfig.sslMode === 'require' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    };

    if (typeof dbConfig.dbPassword === 'string' && dbConfig.dbPassword.length > 0) {
      clientConfig.password = dbConfig.dbPassword;
    }

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
        const safeDbName = String(dbConfig.dbName).replace(/[^a-zA-Z0-9_-]/g, '');
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

    // 1. Create crm_companies table with SERIAL auto-increment primary key
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_companies (
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
      );
    `);

    // 2. Create crm_users table with SERIAL auto-increment primary key
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

    // 3. Create crm_installed_apps table with SERIAL auto-increment primary key
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_installed_apps (
        id SERIAL PRIMARY KEY,
        app_id VARCHAR(100) NOT NULL,
        company_id VARCHAR(100) NOT NULL,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create crm_theme_settings table with SERIAL auto-increment primary key
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_theme_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        company_id VARCHAR(100) NOT NULL,
        theme_mode VARCHAR(20) DEFAULT 'light',
        color_theme VARCHAR(50) DEFAULT 'default',
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4b. Create crm_mail_configurations table for company-based mail settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_mail_configurations (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) UNIQUE NOT NULL,
        enable_mail_otp BOOLEAN NOT NULL DEFAULT FALSE,
        mail_host VARCHAR(255),
        mail_port INTEGER DEFAULT 587,
        mail_user VARCHAR(255),
        mail_password VARCHAR(255),
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create app specific module tables with SERIAL auto-increment primary keys
    // crm_leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_leads (
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
      );
    `);

    // crm_deals
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_deals (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        stage VARCHAR(50) DEFAULT 'prospect',
        amount NUMERIC(12,2) DEFAULT 0,
        closing_date DATE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // crm_contacts
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_contacts (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        company_name VARCHAR(255),
        phone VARCHAR(50),
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // crm_invoices
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_invoices (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        invoice_number VARCHAR(100) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        amount NUMERIC(12,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'unpaid',
        due_date DATE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // crm_calendar_events
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_calendar_events (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        attendees TEXT,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // crm_website_cms
    await client.query(`
      CREATE TABLE IF NOT EXISTS crm_website_cms (
        id SERIAL PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        page_title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        content TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        active_status BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert or update company details in crm_companies
    await client.query(
      `INSERT INTO crm_companies (company_key, name, code, currency, logo, custom_logo_url, plan, db_host, db_port, db_name, db_user, ssl_mode, active_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
       ON CONFLICT (company_key) DO UPDATE SET
         name = EXCLUDED.name,
         code = EXCLUDED.code,
         currency = EXCLUDED.currency,
         custom_logo_url = EXCLUDED.custom_logo_url,
         plan = EXCLUDED.plan,
         db_host = EXCLUDED.db_host,
         db_port = EXCLUDED.db_port,
         db_name = EXCLUDED.db_name,
         db_user = EXCLUDED.db_user,
         ssl_mode = EXCLUDED.ssl_mode;`,
      [
        company.id,
        company.name,
        company.code,
        company.currency,
        company.logo,
        company.customLogoUrl || null,
        company.plan,
        dbConfig.host,
        Number(dbConfig.port) || 5432,
        dbConfig.dbName,
        dbConfig.dbUser,
        dbConfig.sslMode || 'disable',
      ]
    );

    const rawPassword = adminUser.password || '';
    const hashedPassword = rawPassword ? require('crypto').createHash('sha256').update(rawPassword).digest('hex') : null;

    await client.query(
      `INSERT INTO crm_users (user_key, name, email, password, role, company_id, avatar, title, can_install_apps, can_uninstall_apps, can_upload_modules, active_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         company_id = EXCLUDED.company_id;`,
      [
        adminUser.id,
        adminUser.name,
        adminUser.email,
        hashedPassword,
        adminUser.role,
        adminUser.companyId,
        adminUser.avatar,
        adminUser.title,
        adminUser.permissions.canInstallApps,
        adminUser.permissions.canUninstallApps,
        adminUser.permissions.canUploadModules,
      ]
    );

    // Record company mail configuration in crm_mail_configurations
    if (mailConfig) {
      await client.query(
        `INSERT INTO crm_mail_configurations (company_id, enable_mail_otp, mail_host, mail_port, mail_user, mail_password, active_status)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (company_id) DO UPDATE SET
           enable_mail_otp = EXCLUDED.enable_mail_otp,
           mail_host = EXCLUDED.mail_host,
           mail_port = EXCLUDED.mail_port,
           mail_user = EXCLUDED.mail_user,
           mail_password = EXCLUDED.mail_password;`,
        [
          company.id,
          Boolean(mailConfig.enableMailOtp),
          mailConfig.mailHost || null,
          Number(mailConfig.mailPort) || 587,
          mailConfig.mailUser || null,
          mailConfig.mailPassword || null,
        ]
      );
    }

    // Record installed apps in crm_installed_apps
    if (Array.isArray(selectedApps)) {
      for (const appId of selectedApps) {
        await client.query(
          `INSERT INTO crm_installed_apps (app_id, company_id, active_status) VALUES ($1, $2, TRUE);`,
          [appId, company.id]
        );
      }
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Workspace schema provisioned & registration data persisted in PostgreSQL!',
    });
  } catch (err: any) {
    console.error('PostgreSQL persistence error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to persist company registration details to PostgreSQL.',
      },
      { status: 500 }
    );
  }
}
