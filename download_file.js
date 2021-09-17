import * as stream from 'stream';
import { promisify } from 'util';

const finished = promisify(stream.finished);

export async function downloadFile(fileUrl, writeStream) {
    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(async response => {
        response.data.pipe(writeStream);
        return await finished(writeStream);
    });
}