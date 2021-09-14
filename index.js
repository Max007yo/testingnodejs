const axios = require('axios').default;
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const download_url = 'https://dl3.downloadly.ir/Files/Elearning/Udemy_Build_Your_Own_First_Person_Shooter_Survival_Game_in_Unity_2019-8.part1_Downloadly.ir.rar';

app.get('/', (req, res) => {
    res.end('hello');
});

app.get('/test', async (req, res) => {
    const r = await axios.head(download_url);
    res.end(JSON.stringify(r.headers));
});

app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}...`));