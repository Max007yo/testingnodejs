const path = require('path');

const { Storage } = require('megajs');
const axios = require('axios').default;

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.end('server is up and running...');
});

app.post('/upload-to-mega/', (req, res, next) => {
    const clientId = makeId(8);
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
                r.data.pipe(upload);

                upload.on('close', () => console.log(`Client ${clientId} Upload Finished`));
                upload.on('error', err => console.log(`Client ${clientId} Upload ` + err));

                r.data.on('end', () => console.log(`Client ${clientId} Download Complete`));
                r.data.on('error', err => console.log(`Client ${clientId} Download ` + err));

                let downloadedMB = 0;
                const fileSizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
                r.data.on('data', chunk => downloadedMB += (chunk.length / (1024 * 1024)));
                const progressTimer = setInterval(() => {
                    console.log(`Client ${clientId} ${downloadedMB.toFixed(2)}/${fileSizeInMB}MB Downloaded`);
                    if(downloadedMB.toFixed(2) === fileSizeInMB) clearInterval(progressTimer);
                }, 2 * 1000);

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

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } return result;
}