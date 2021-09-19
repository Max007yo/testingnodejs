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
    try {
        const storage = new Storage({
            email: req.body.email,
            password: req.body.password,
        }, async () => {
            const r = await axios.get(req.body.fileUrl, { responseType: 'stream' });
            r.data.pipe(storage.upload(path.basename(req.body.fileUrl)));
        });

        res.end('uploading...');
    } catch(err) {
        console.log(err)
        res.end('upload failed');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}...`));

