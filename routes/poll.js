const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

const keys = require('../config/keys');

let pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
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