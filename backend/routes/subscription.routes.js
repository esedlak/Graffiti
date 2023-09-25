const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BDy8zWY6tczZsikIyzU3Zl2150QNwnreBehIgz_s_5aOh6IbZYqS4pk2-xA86Gp-CuD9oVyK0St3u_wWMMR61Nc';
const privateVapidKey = 'NLBM2dvrkoS5DGPI96glceoBgFsGkqURU_V2GM3yDBY';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:elisa.sedlak@student.htw-berlin.de', publicVapidKey, privateVapidKey);
});

module.exports = router;
