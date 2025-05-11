const { google } = require('googleapis');
const oauth2Client = require('../config/oauth');
const { Readable } = require('stream');


const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

async function uploadFile(fileBuffer, fileName, mimeType) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType
            },
            media: {
                mimeType: mimeType,
                 body: bufferToStream(fileBuffer)
            }
        });
        const fileId = response.data.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { uploadFile };