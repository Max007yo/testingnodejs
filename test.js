const { url } = require('inspector');
const path = require('path');

const sample_url = 'https://dl3.downloadly.ir/Files/Elearning/Udemy_Build_Your_Own_First_Person_Shooter_Survival_Game_in_Unity_2019-8.part1_Downloadly.ir.rar';

const p = path.parse(sample_url);

console.log(p.base);