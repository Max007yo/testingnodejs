const path = require('path');

const { Storage } = require('megajs');
const axios = require('axios').default;

const express = require('express');
const { randomUUID } = require('crypto');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.end('server is up and running...');
});

app.post('/upload-to-mega/', (req, res, next) => {
    const clientId = randomUUID();
    const storage = new Storage({
        email: req.body.email,
        password: req.body.password,
    }, async err => {
        if(!err) {
            console.log(`Client ${clientId} Connected to Mega cloud with no errors`);
            try {

                console.log(`Client ${clientId} Request sent to ${req.body.fileUrl}`);
                const r = await axios.get(req.body.fileUrl, { responseType: 'stream' });
                console.log(`Client ${clientId} Got response from ${req.body.fileUrl}`);

                const fileSize = parseInt(r.headers['content-length']);
                const upload = storage.upload({ name: path.basename(req.body.fileUrl), size: fileSize });

                upload.on('close', () => console.log(`Client ${clientId} Upload Finished`));
                upload.on('error', err => console.log(`Client ${clientId} Upload ` + err));

                r.data.on('end', () => console.log(`Client ${clientId} Download Complete`));
                r.data.on('error', err => console.log(`Client ${clientId} Download ` + err));

                r.data.pipe(upload);

                console.log(`Client ${clientId} Uploading...`);
                res.end('Uploading...');

            } catch(e) { 
                console.log(e);
                res.end(e.message);
            }
        }else {
            console.log(err);
            res.end(err.message);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}...`));

