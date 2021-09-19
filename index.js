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
    const storage = new Storage({
        email: req.body.email,
        password: req.body.password,
    }, async err => {
        if(!err) {
            console.log('connected to mega with no errors');
            try {
                console.log('sending request...');
                const r = await axios.get(req.body.fileUrl, { responseType: 'stream' });
                console.log('got response');
                storage.upload(path.basename(req.body.fileUrl), r.data,
                    err => {
                        if(!err) console.log('upload complete');
                        else console.log(err);
                });
                console.log('uploading...');
                res.end('uploading...');
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

