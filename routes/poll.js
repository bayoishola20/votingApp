const express = require('express');
const router = express.Router();

const Pusher = require('pusher');

let pusher = new Pusher({
  appId: '468819',
  key: '0b8806dddaba260eed07',
  secret: '8dc6eef5049a6d7bac93',
  cluster: 'ap1',
  encrypted: true
});

router.get('/', (req, res) => {
    res.send('POLL');
});

router.post('/', (req, res) => {
    pusher.trigger('voting-application', 'political-parties', {
        points: 1,
        party: req.body.party
      });

      return res.json({ success: true, message: 'Thank you for voting' });
});

module.exports = router;