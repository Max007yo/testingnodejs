const axios = require('axios').default;
var Client = require('ftp');

var c = new Client();

const sample_url = 'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip';

c.on('ready', async function() {
    console.log('connected to ftp')
    
    const r = await axios.get(sample_url, { responseType: 'stream' });

    c.put(r.data, '/htdocs/sample.zip', function(err) {
        if (err) throw err;
        c.end();
    });
});

c.connect({
    user: 'epiz_29761231',
    password: 'iQ1t71zkFoaWAd',
    host: 'ftpupload.net',
});