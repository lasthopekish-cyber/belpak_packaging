/**
 * Belpak Packaging — website lead inbox (Google Apps Script)
 *
 * Setup (about 5 minutes):
 * 1. Open the Google Sheet that should receive leads (e.g. "belpak leads").
 * 2. Extensions → Apps Script. Paste this whole file, replacing what's there. Save.
 * 3. Optional: set NOTIFY_EMAIL below to get an email for every new lead.
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as: Me    ·    Who has access: Anyone
 *    Authorise when asked, then copy the Web app URL (ends in /exec).
 * 5. In index.html, set  SITE.leadEndpoint = "<that URL>"  and redeploy the website.
 *
 * Each submission becomes one row in the "Website Leads" tab. Uploaded artwork
 * (custom packaging form, up to 5 MB) is saved to a Drive folder and linked in the row.
 */
const SHEET_NAME = 'Website Leads';
const NOTIFY_EMAIL = 'belpakpackaging@gmail.com';   // set to '' to turn off emails
const UPLOAD_FOLDER = 'Belpak website uploads';

const COLUMNS = ['Received', 'Reference', 'Type', 'Name', 'Phone', 'Email', 'Company', 'Product', 'Size / design',
  'Quantity', 'Packaging type', 'Use / industry', 'Customisation', 'Options', 'Dimensions', 'Material / finish',
  'Branding', 'Timeline', 'Inquiry type', 'Unit price', 'Estimate', 'City', 'PIN', 'Message', 'File', 'Page', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (!d.name || !d.phone) return out({ ok: false, error: 'missing name or phone' });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(COLUMNS); sh.setFrozenRows(1); }
    const ref = 'BP-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
    let fileUrl = '';
    if (d.fileData && d.fileName) {
      const folders = DriveApp.getFoldersByName(UPLOAD_FOLDER);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(UPLOAD_FOLDER);
      const blob = Utilities.newBlob(Utilities.base64Decode(d.fileData), d.fileType || 'application/octet-stream', ref + ' ' + d.fileName);
      fileUrl = folder.createFile(blob).getUrl();
    } else if (d.fileName) { fileUrl = d.fileName + ' (not uploaded)'; }
    const kinds = { inquiry: 'Bulk inquiry', custom: 'Custom packaging', contact: 'Contact', order: 'Order request' };
    sh.appendRow([new Date(), ref, kinds[d.kind] || d.kind, d.name, "'" + d.phone, d.email, d.company, d.product, d.variant,
      d.quantity, d.packagingType, d.industry, d.customization, (d.options || []).join(', '), d.dimensions, d.finish,
      d.branding, d.timeline, d.inquiryType, d.unitPrice, d.estimate, d.city, d.pin, d.message || d.description || d.notes,
      fileUrl, d.source, 'New']);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, `New ${kinds[d.kind] || 'lead'} — ${d.name}${d.product ? ' — ' + d.product : ''} (${ref})`,
        Object.entries(d).filter(([k, v]) => v && k !== 'fileData').map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n') + (fileUrl ? `\nfile: ${fileUrl}` : ''));
    }
    return out({ ok: true, ref });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}
function doGet() { return out({ ok: true, service: 'Belpak lead inbox' }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
