// src/api/axios-config.ts

import axios from 'axios';
import https from 'https';

const axiosI = axios.create({
    baseURL: 'http://sruz5234.odns.fr',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        requestCert : false
    })
});

export default axiosI;
