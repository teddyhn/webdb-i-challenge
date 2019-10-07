const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving accounts" });
        });
});

router.get('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            account ? res.status(200).json(account) : res.status(404).json({ message: "account not found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving specified account" })
        });
});

router.post('/', validateAccount, (req, res) => {
    db('accounts')
        .insert(req.body, 'id')
        .then(id => {
            res.status(200).json(id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error adding account" })
        });
});

router.put('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            res.status(200).json(count);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error updating account" })
        });
});

router.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200).json(count);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error deleting account" })
        });
});

function validateAccount(req, res, next) {
    const { name, budget } = req.body;
    console.log(req.body);
    if (req.body && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing account data" })
    } else if (!name || !(budget >= 0)) {
        res.status(400).json({ message: "missing required field(s)" })
    } else next();
}


module.exports = router;