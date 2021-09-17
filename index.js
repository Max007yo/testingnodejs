const axios = require('axios').default;
const express = require('express');
const app = express();

const download_url = 'https://dl3.downloadly.ir/Files/Elearning/Udemy_Build_Your_Own_First_Person_Shooter_Survival_Game_in_Unity_2019-8.part1_Downloadly.ir.rar';
const sample_url = 'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip';

headers = {
    // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    // 'Accept-Encoding': 'gzip, deflate, br',
    // 'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    // 'Host': 'dl3.downloadly.ir',
    // 'Sec-Fetch-Dest': 'document',
    // 'Sec-Fetch-Mode': 'navigate',
    // 'Sec-Fetch-Site': 'none',
    // 'Sec-Fetch-User': '?1',
    // 'Sec-GPC': '1',
    // 'Upgrade-Insecure-Requests': '1',
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
}


app.use((err, req, res, next) => {
    res.end('err');
});

app.get('/', (req, res) => {
    res.end('server is up and running...');
});

app.get('/test', async (req, res) => {
    const r = await axios.get(download_url, {
        responseType: 'stream',
        headers: headers
    });

    r.data.pipe(res)
    
    // res.end(JSON.stringify(r.headers));
});

app.get('/download', async (req, res) => {
    const r = await axios.head(download_url);
    res.end(JSON.stringify(r.headers));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}...`));

