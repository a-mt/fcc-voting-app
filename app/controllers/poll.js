'use strict';

var Poll = require('../models/poll');

function PollHandler(){

    // List polls
    this.list = function(req, res) {
        Poll.find({}, function(err, docs){
            if(err) throw err;

            res.render('index', {
                title: 'Homepage',
                docs: docs
            });
        });
    };

    // Create a new poll
    this.create = function(req, res) {
        res.render('poll/new', {
            title: 'Add a new poll',
            errors: req.flash('errors').pop() || {},
            data: req.flash('data').pop() || {}
        });
    };

    this.createSubmit = function(req, res) {

        // Create new poll object
        var poll = new Poll();
        poll._creator= req.user._id;
        poll.title   = req.body.title;
        poll.options = [];

        for(var i=0; i<req.body.options.length; i++) {
            var opt = req.body.options[i].trim();
            if(opt) {
                poll.options.push({
                    title: opt
                });
            }
        }

        // Check number of opts
        var err = false;
        if(poll.options.length < 2) {
            err = 'There must be at least two options';
        } else if(poll.options.length > 30) {
            err = 'You can\'t add than 30 options!';
        }
        if(err) {
            req.flash('data', req.body);
            req.flash('errors', {
                options: {message: err}
            });
            res.redirect('/new/poll');
            return;
        }

        // Save to database
        poll.nboptions = poll.options.length;
        poll.save(function(err, saved){

            // Data validation failed ?
            if(err) {
                req.flash('errors', err.errors);
                req.flash('data', req.body);
                res.redirect('/new/poll');
            } else {
                req.flash('success', 'Your poll has been successfully created');
                res.redirect('/poll/' + saved._id.toHexString());
            }
        });
    };
    
    // Vote for a choice
    this.vote = function(req, res) {
        var id = req.params[0];
        Poll.findById(id)
            .populate('_creator')
            .exec(function (err, poll) {
            
            // Not found
            if(err) {
                res.status(404).send('Not found');
                return;
            }
            res.render('poll/vote', {
                title: 'Poll: ' + poll.title,
                url: '/poll/' + id,
                poll: poll,
                error: req.flash('error').pop()
            });
        });
    };
    this.voteSubmit = function(req, res) {
        var id  = req.params[0];

        // Check submit
        if(!req.body.options) {
            req.flash('error', 'You have to choose an option to vote');
            res.redirect(req.url);
            return;
        }
        
        var find = {'_id': id};
        var update = { '$inc': { 'totalclicks': 1 } };

        // Add a new option ?
        var newOpt = (req.body.options == 'custom');
        if(newOpt) {
            newOpt = req.body.custom.trim();
            if(newOpt.length == 0) {
                req.flash('error', 'You can\'t add an empty choice!');
                res.redirect('/poll/' + id);
                return;
            }

            var option = {
                title: newOpt,
                nbclicks: 1
            };
            update['$push'] = { 'options': option };

        // Vote for an existing option
        } else {
            var num = Number(req.body.options);
            find['options.' + num] =  { '$exists': true };
            update['$inc']['options.' + num + '.nbclicks'] = 1;
        }

        // Save the changes
        Poll.update(find, update, function(err, changes){
            if(err) { req.flash('error', err.message); }
            res.redirect('/poll/' + id + '/results');
        });
    };
    
    // Delete poll
    this.delete = function(req, res) {
        var id = req.body.id;
        if(!id) {
            res.status(404).send('Not found');
            return;
        }

        Poll.findById(id, function (err, poll) {

            // Not found
            if(err) {
                res.status(404).send('Not found');
                return;
            }
            // Denied
            if(poll._creator != req.user.id) {
                res.status(403).send('Forbidden');
                return;
            }
            // Delete
            poll.remove(function(){
                res.send('OK');
            });
        });
    };
    
    // View results
    this.view = function(req, res) {
        var id = req.params[0];
        Poll.findById(id)
            .populate('_creator')
            .exec(function (err, poll) {

            // Not found
            if(err) {
                res.status(404).send('Not found');
                return;
            }
            res.render('poll/view', {
                title: 'Results of poll: ' + poll.title,
                poll: poll,
                error: req.flash('error').pop()
            });
        });
    };
    
    // View user's polls
    this.listUser = function(req, res) {
        Poll.find({
            _creator: req.user.id
        }, function (err, docs) {
            if(err) throw err;

            res.render('poll/list', {
                title: 'My polls',
                docs: docs
            });
        });
    };
}

module.exports = PollHandler;