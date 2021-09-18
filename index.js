const path = require('path');

const Client = require('ftp');
const axios = require('axios').default;

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.end('server is up and running...');
});

app.post('/upload-to-ftp/', async (req, res, next) => {

    const data = req.body;

    const ftpCredentials = {
        user: data.username,
        password: data.password,
        host: data.hostname
    }

    const c = new Client();

    c.on('ready', async function() {
        console.log('connected to ftp')
        res.end('uploading....')
        
        const r = await axios.get(data.uploadUrl, { responseType: 'stream' });
    
        c.mkdir(data.uploadPath.toString(), true, err => { if(err) console.log(err) });
        c.put(r.data, `/${data.uploadPath.toString()}/${path.basename(data.uploadUrl)}`, function(err) {
            if (err) console.log(err);
            c.end();
        });

    });

    c.on('error', err => console.log(err));

    c.connect(ftpCredentials);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}...`));

