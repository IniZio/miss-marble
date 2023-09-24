/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs';
import { google, type sheets_v4 } from 'googleapis';
import path from 'path';


const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];
const spreadSheetId = '1E5v8Ilbl1Vk8d_hIGIJSjnmp_bS5K-MtT6QD9vhAGfM';
// const spreadSheetId = '1s_PcdLtCjsHOWZNEbZffH5uWsgdKqv-iaZcfqwt5pUI';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
const json = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'marble-service-account.json')) as unknown as string) as any;

class GoogleSheetRespository {
  googleSheet: sheets_v4.Sheets
  jwtClient = new google.auth.JWT(
    json.client_email,
    undefined,
    json.private_key,
    SCOPES
  );
  spreadSheetId: string;
  snapshotSpreadSheetId?: string;

  constructor({ spreadSheetId: _spreadSheetId = spreadSheetId, snapshotSpreadSheetId }: {spreadSheetId?: string, snapshotSpreadSheetId?: string} = {}) {
    this.googleSheet = google.sheets('v4');
    this.spreadSheetId = _spreadSheetId;
    this.snapshotSpreadSheetId = snapshotSpreadSheetId
  }

  async init() {
    await new Promise((resolve, reject) => {
      this.jwtClient.authorize(function (err) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(undefined);
        }
      });
      google.options({ auth: this.jwtClient });
    })
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async insertRow(row: any) {
    const values = [
      row
    ];

    await this.init();
    await this.googleSheet.spreadsheets.values.append({
      spreadsheetId: this.spreadSheetId,
      range: 'A:A',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values,
      },
    });
  }

  async getAllRows() {
    await this.init();
    const res = await this.googleSheet.spreadsheets.values.get({
      auth: this.jwtClient,
      spreadsheetId: this.spreadSheetId,
      range: 'A1:CM'
    });
    return (res.data.values ?? []).slice(1);
  }
}

const googlesheet = new GoogleSheetRespository({
  spreadSheetId: spreadSheetId,
})

export default googlesheet;