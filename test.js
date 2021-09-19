const axios = require('axios').default;
const { Storage } = require('megajs')

const sampleUrl = 'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip';

// email: 'mayex66650@sicmag.com',
// password:  'Max@12345',

function uploadToMega(email, password, filePath) {
    const storage = new Storage({
        email: email,
        password: password,
    }, async () => {
        const r = await axios.get(sampleUrl, { responseType: 'stream' });
        r.data.pipe(storage.upload(filePath));
    });
}