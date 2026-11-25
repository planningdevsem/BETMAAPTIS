/**
 * BETMA ENGLISH - Google Sheets receiver
 * Deploy as Web App: Execute as Me; access: Anyone.
 * Replace SPREADSHEET_ID with the ID from the Google Sheets URL.
 */
const SPREADSHEET_ID = '1DSXJqiT6fqR_wCvZ_vxsd-AULqDhuGOCDaKfalYoxuA';
const SHEET_NAME = 'APTIS_RESULTS';

const HEADERS = [
  'Submission ID','Test ID','Test Name','Submitted At',
  'Họ và tên','SĐT','Email',
  'Grammar đúng','Grammar tổng','Grammar %',
  'Vocabulary đúng','Vocabulary tổng','Vocabulary %',
  'Listening đúng','Listening tổng','Listening %','Listening /50',
  'Reading đúng','Reading tổng','Reading %','Reading /50',
  'Writing (tất cả câu)','Writing status','Raw answers'
];

function doGet() {
  return json_({ ok: true, service: 'BETMA ENGLISH Google Sheets API' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'Empty request body' });
    }
    const data = JSON.parse(e.postData.contents);
    if (!data.submissionId) throw new Error('Missing submissionId');

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    // Idempotency: retries for the same attempt must not create duplicate rows.
    const idCol = 1;
    const last = sheet.getLastRow();
    if (last >= 2) {
      const ids = sheet.getRange(2, idCol, last - 1, 1).getValues().flat();
      if (ids.includes(String(data.submissionId))) {
        return json_({ ok: true, duplicate: true, submissionId: data.submissionId });
      }
    }

    const c = data.candidate || {};
    const scores = data.scores || {};
    const g = scores.grammar || {};
    const v = scores.vocabulary || {};
    const l = scores.listening || {};
    const r = scores.reading || {};
    const writing = Array.isArray(data.writing) ? data.writing : [];

    const row = [
      String(data.submissionId),
      data.testId || '',
      data.testName || '',
      data.submittedAt || new Date().toISOString(),
      c.name || '', c.phone || '', c.email || '',
      g.correct || 0, g.total || 0, g.percent || 0,
      v.correct || 0, v.total || 0, v.percent || 0,
      l.correct || 0, l.total || 0, l.percent || 0, l.score50 || 0,
      r.correct || 0, r.total || 0, r.percent || 0, r.score50 || 0,
      JSON.stringify(writing),
      data.writingStatus || 'Chờ giáo viên chấm',
      JSON.stringify(data.rawAnswers || {})
    ];
    sheet.appendRow(row);
    return json_({ ok: true, submissionId: data.submissionId });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional: run once from the Apps Script editor to create the tab and headers. */
function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}
