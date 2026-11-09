const nodemailer = require('nodemailer');
const { oneLine, refCode } = require('./util');
const { STATUS_LABEL } = require('./db');

function leadText(config, lead, id) {
  const lines = [
    `Új ajánlatkérés érkezett a ${config.siteName} oldalról.`,
    '',
    `Hivatkozás: ${refCode(id)}`,
    `Időpont: ${lead.submitted_at || ''}`,
    `Név: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefon: ${lead.phone}`,
    `Település: ${lead.city}`,
    `Ingatlan típusa: ${lead.property_type}`,
    `Becsült alapterület: ${lead.floor_area || 'nincs megadva'}`,
    `Tervezett munka: ${lead.project_type}`,
    `Kért dokumentáció: ${lead.documentation}`,
    `Tervező: ${lead.designer || 'nincs megadva'}`,
    `Kívánt határidő: ${lead.deadline || 'nincs megadva'}`,
    `Megjegyzés: ${lead.comment || 'nincs'}`,
    '',
    `Forrásdomain: ${lead.source_domain}`,
    `Forrás URL: ${lead.source_url || 'nincs'}`,
    `Kampány: ${lead.utm_campaign || 'nincs'}`,
    `UTM source / medium: ${lead.utm_source || '-'} / ${lead.utm_medium || '-'}`,
    `UTM term / content: ${lead.utm_term || '-'} / ${lead.utm_content || '-'}`,
    `Státusz: ${STATUS_LABEL[lead.status] || lead.status}`,
    '',
    'Az oldal nem készített árat. Az ajánlat a kimenet és a helyszín tisztázása után adható.',
  ];
  return lines.join('\n');
}

function customerText(config, lead, id) {
  return [
    `Kedves ${oneLine(lead.name, 100)}!`,
    '',
    'Rögzítettük az ajánlatkérését a meglévő állapotfelmérésről.',
    `Hivatkozási szám: ${refCode(id)}`,
    '',
    'Átnézzük a megadott adatokat. Ha a tervezői kimenethez vagy a helyszínhez hiányzik valami, visszakérdezünk. Írásos ajánlatot ezután küldünk. Az űrlap nem számít automatikus árat, és nem keletkezik belőle szerződés.',
    '',
    `Ha néhány munkanapon belül nem jelentkezünk, írjon a ${config.contactEmail} címre, és tüntesse fel a hivatkozási számot.`,
    '',
    config.companyShortName,
    config.siteUrl,
  ].join('\n');
}

async function notifyLead(config, lead, id) {
  if (!config.smtp.host) return 'nincs_smtp';
  if (!config.contactEmail) return 'nincs_cimzett';
  const from = config.smtp.from || config.contactEmail;
  const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  let operatorOk = false;
  try {
    await transport.sendMail({
      from,
      to: config.contactEmail,
      replyTo: oneLine(lead.email, 160),
      subject: `Új ajánlatkérés: ${oneLine(lead.name, 80)}, ${oneLine(lead.city, 80)} (${refCode(id)})`,
      text: leadText(config, lead, id),
    });
    operatorOk = true;
    if (config.smtp.sendCustomerCopy) {
      await transport.sendMail({
        from,
        to: oneLine(lead.email, 160),
        replyTo: config.contactEmail,
        subject: `Rögzítettük az ajánlatkérését (${refCode(id)})`,
        text: customerText(config, lead, id),
      });
    }
    return 'elkuldve';
  } catch (error) {
    console.error(`SMTP hiba (${refCode(id)}): ${error.message}`);
    return operatorOk ? 'reszben' : 'hiba';
  }
}

module.exports = { notifyLead };
