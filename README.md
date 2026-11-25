# BETMA ENGLISH – GitHub Pages + Google Sheets

## What is included
- `index.html`: original BETMA English site with Google Sheets submission integration.
- `config.js`: already configured with the Web App URL you supplied.
- `Code.gs`: Google Apps Script receiver that writes one row per submitted test into `APTIS_RESULTS`.
- `.nojekyll`: GitHub Pages helper.

The website keeps the existing test content and answer keys. At final submission it sends candidate name, phone, email, Grammar, Vocabulary, Listening, Reading scores, and every Writing prompt/answer (including unanswered Writing prompts) to Google Sheets. Each attempt has a unique submission ID; Apps Script uses a lock and duplicate check so retries do not overwrite or duplicate an existing attempt.

## Step 1 — Create the Google Sheet
1. Use the Google Spreadsheet you supplied. Its ID has already been inserted into `Code.gs`.
2. Open the spreadsheet while signed in to the Google account that will own/deploy the Apps Script.
3. Keep the spreadsheet open for the next step.

## Step 2 — Deploy Google Apps Script
1. Open https://script.google.com and create a new project.
2. Replace the editor contents with `Code.gs` from this package.
3. The spreadsheet ID is already configured in the supplied `Code.gs`; do not replace it unless you change spreadsheets.
4. Save the project.
5. Select `setupSheet` and click Run once; approve the requested permissions. This creates the `APTIS_RESULTS` tab and header row in your spreadsheet.
6. Click Deploy → New deployment → select type **Web app**.
7. Set **Execute as: Me** and **Who has access: Anyone**.
8. Click Deploy, authorize if prompted, then copy the Web App URL. It must start with `https://script.google.com/macros/s/`.

## Step 3 — Confirm the website endpoint
The supplied Web App URL is already saved in `config.js`. If you redeploy Apps Script and receive a different `/exec` URL, replace the URL in `config.js` and save.

## Step 4 — Upload to GitHub
1. Create a GitHub repository (Public is simplest for GitHub Pages).
2. Upload `index.html`, `config.js`, `.nojekyll`, and `README.md` to the repository root. Keep `index.html` at the root.
3. Open repository Settings → Pages.
4. Under Build and deployment, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
5. Wait for GitHub Pages to publish the site.

## Step 5 — Test before sharing
1. Open the published website using its HTTPS GitHub Pages URL.
2. Enter a test candidate name, phone, and email.
3. Complete a test, enter text in every Writing question, and submit.
4. Open the `APTIS_RESULTS` tab and verify that one new row appears, including the scores and the `Writing (tất cả câu)` JSON cell.
5. Submit a second test with different details and verify it creates a second row.

## Google Sheets columns
- Candidate details: Họ và tên, SĐT, Email.
- Objective scores: Grammar, Vocabulary, Listening, Reading (correct count, total, percentage; Listening/Reading also include /50).
- Writing: a JSON array containing every Writing question number, prompt, and answer.
- Status: `Chờ giáo viên chấm` for Writing.

## Important notes
- GitHub Pages is static hosting; Google Apps Script is the receiving endpoint and Google Sheets is the database.
- Apps Script deployment must allow access to **Anyone**, otherwise participants cannot submit.
- The browser's `no-cors` request mode cannot read the server's response. The sheet is the source of truth: always verify a test row appears before distributing the public link.
- Apps Script has execution quotas. For normal class placement-test volumes this is usually sufficient, but monitor quotas for large simultaneous sessions.
- The website currently asks for a test password (`1111`) in its existing login flow. Change that in `index.html` if needed before public launch. This is a client-side gate, not secure authentication.
- Audio and speaking recording behavior from the original site is retained. This integration sends the four requested objective scores and all Writing responses; it does not upload Speaking audio recordings.
