const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

let pusher = new Pusher({
  appId: '468819',
  key: '0b8806dddaba260eed07',
  secret: '8dc6eef5049a6d7bac93',
  cluster: 'ap1',
  encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
    const newVote = {
        points: 1,
        party: req.body.party
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('voting-application', 'political-parties', {
            points: parseInt(vote.points),
            party: vote.party
        });

      return res.json({ success: true, message: 'Thank you for voting' });
    });
});

module.exports = router;