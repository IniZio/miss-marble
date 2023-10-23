/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs';
import { google, type drive_v3 } from 'googleapis';
import path from 'path';


const SCOPES = [
  'https://www.googleapis.com/auth/drive',
];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
const json = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? fs.readFileSync(path.join(process.cwd(), 'marble-service-account.json')) as unknown as string) as any;

export class GoogleDriveRespository {
  googleDrive: drive_v3.Drive
  jwtClient = new google.auth.JWT(
    json.client_email,
    undefined,
    json.private_key,
    SCOPES
  );
  spreadSheetId: string;
  snapshotSpreadSheetId?: string;

  constructor() {
    this.googleDrive = google.drive('v3');
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

  async downloadFile(url: string) {
    await this.init();
    const fileId = url.split('id=').pop();

    const media = await this.googleDrive.files.get({
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'arraybuffer' });
    const file = await this.googleDrive.files.get({
      fileId: fileId,
    });
    return [file.data, media.data as unknown as ArrayBuffer] as const;
  }
}