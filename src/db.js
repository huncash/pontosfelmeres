const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const STATUSES = [
  ['uj', 'Új'],
  ['egyeztetes', 'Egyeztetés alatt'],
  ['ajanlat_kuldve', 'Ajánlat kiküldve'],
  ['lezarva', 'Lezárva'],
  ['nem_relevans', 'Nem releváns'],
  ['spam', 'Spam'],
];

const STATUS_LABEL = Object.fromEntries(STATUSES);

function openDatabase(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submitted_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      source_domain TEXT NOT NULL DEFAULT '',
      source_url TEXT NOT NULL DEFAULT '',
      utm_source TEXT NOT NULL DEFAULT '',
      utm_medium TEXT NOT NULL DEFAULT '',
      utm_campaign TEXT NOT NULL DEFAULT '',
      utm_term TEXT NOT NULL DEFAULT '',
      utm_content TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      property_type TEXT NOT NULL DEFAULT '',
      floor_area TEXT NOT NULL DEFAULT '',
      project_type TEXT NOT NULL DEFAULT '',
      documentation TEXT NOT NULL DEFAULT '',
      designer TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      consent INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'uj',
      mail_status TEXT NOT NULL DEFAULT ''
    );
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_leads_submitted ON leads(submitted_at)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)');

  const insert = db.prepare(`
    INSERT INTO leads (
      submitted_at, updated_at, source_domain, source_url,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      name, email, phone, city, property_type, floor_area, project_type,
      documentation, designer, deadline, comment, consent, status, mail_status
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    )
  `);
  const updateMail = db.prepare('UPDATE leads SET mail_status = ?, updated_at = ? WHERE id = ?');
  const updateStatus = db.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?');
  const getById = db.prepare('SELECT * FROM leads WHERE id = ?');
  const ping = db.prepare('SELECT 1 AS ok');

  return {
    file,
    insertLead(lead) {
      const now = new Date().toISOString();
      const result = insert.run(
        now,
        now,
        lead.source_domain,
        lead.source_url,
        lead.utm_source,
        lead.utm_medium,
        lead.utm_campaign,
        lead.utm_term,
        lead.utm_content,
        lead.name,
        lead.email,
        lead.phone,
        lead.city,
        lead.property_type,
        lead.floor_area,
        lead.project_type,
        lead.documentation,
        lead.designer,
        lead.deadline,
        lead.comment,
        lead.consent ? 1 : 0,
        lead.status || 'uj',
        lead.mail_status || 'fuggo'
      );
      return Number(result.lastInsertRowid);
    },
    setMailStatus(id, mailStatus) {
      updateMail.run(mailStatus, new Date().toISOString(), id);
    },
    updateStatus(id, status) {
      if (!STATUS_LABEL[status]) return false;
      const result = updateStatus.run(status, new Date().toISOString(), id);
      return result.changes > 0;
    },
    getLead(id) {
      return getById.get(id) || null;
    },
    listLeads({ status = '', q = '', includeSpam = false } = {}) {
      const query = q.trim();
      const like = `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
      const sql = `
        SELECT * FROM leads
        WHERE (? = 1 OR status != 'spam')
          AND (? = '' OR status = ?)
          AND (
            ? = ''
            OR name LIKE ? ESCAPE '\\'
            OR email LIKE ? ESCAPE '\\'
            OR phone LIKE ? ESCAPE '\\'
            OR city LIKE ? ESCAPE '\\'
            OR project_type LIKE ? ESCAPE '\\'
          )
        ORDER BY id DESC
        LIMIT 500
      `;
      return db.prepare(sql).all(
        includeSpam ? 1 : 0,
        status,
        status,
        query,
        like,
        like,
        like,
        like,
        like
      );
    },
    ping() {
      return ping.get();
    },
    close() {
      db.close();
    },
  };
}

module.exports = { openDatabase, STATUSES, STATUS_LABEL };
