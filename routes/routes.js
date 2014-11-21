var express = require("express");
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
    var router = express.Router();

    router.get('/', function(req, res, next) {
        if (req.user) {
            return res.redirect('/dash');
        }
        res.render('index', {
            title: "Epic Story"
        })
    });
    //DASHBOARD 

    router.all('/dash/*', ensureAuthenticated('/login'));
    router.all('/story/edit/*', ensureAuthenticated('/login'));

    router.get('/dash', function(req, res, next) {
        if (req.user) {
            req.user.getStories()
                .sort({
                    title: 1
                })
                .exec(function(err, stories) {
                    res.render('dash.html', {
                        title: "Epic Story - Build Your Story",
                        stories: stories
                    });
                });
        }
        else {
            return res.redirect('/login');
        }
    });
    router.get('/dash/add', function(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render('add', {
            title: "Epic Story - Add a Story"
        });
    });
    router.post('/dash/add', function(req, res, next) {
            if (!req.user) {
                return res.status(401).send("Not authorized.");
            }
            var story = req.user.newStory();
            if (req.body.title == "" || req.body.title.length < 1) {
                return res.render('add', {
                    title: "Epic Story - Add a Story",
                    notification: {
                        severity: "error",
                        message: "Your story must have a name!"
                    }
                });
            }
            console.log(req.body);
            story.set({
                title: req.body.title
            });
            story.save(function(err) {
                if (err) {
                    res.render('add', {
                        title: "Epic Story - Add a Story",
                        notification: {
                            severity: "error",
                            message: "There was a problem making your story, try again later."
                        }
                    });
                }
                else {
                    res.redirect('/dash');
                }
            });
        })
        //#
        //end dash
        //#

    //######
    //Story Routes
    //######
    router.get('/story/:id', function(req, res, next) {
        if (req.user) {
            req.user.getStoryById(req.params.id, function(err, story) {
                res.render('story', {
                    title: "Epic Story - Build Your Story",
                    story: story
                });
            });
        }
        else {
            return res.redirect('/login');
        }
    });
    router.get('/story/edit/:id', function(req, res, next) {
        if (req.user) {
            req.user.getStoryById(req.params.id, function(err, story) {
                res.render('editStory', {
                    title: "Epic Story - Build Your Story",
                    story: story
                });
            });
        }
        else {
            return res.redirect('/login');
        }
    });
    router.post('/story/edit/:type/:id', function(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        req.user.getStoryById(req.params.id, function(err, story) {
            var sections = [{
                body: req.body.section
            }];
            var type = req.params.type;
            if (type == "departure") {
                console.log(sections);
                story.set({
                    departure: sections
                });
            }
            else if (type == "initiation") {
                story.set({
                    initiation: sections
                });
            }
            else if (type == "return") {
                story.set({
                    theReturn: sections
                });
            }
            else {
                return res.redirect('/story/' + req.params.id);
            }
            story.save(function(err){
                if (err){
                    console.log(err);
                } else {
                    return res.redirect('/story/' + req.params.id);
                }
            });
            
        });
    });
    router.get('/story/edit/:type/:id', function(req, res, next) {
        if (req.user) {
            req.user.getStoryById(req.params.id, function(err, story) {
                var type = req.params.type;
                if (type == "departure") {
                    res.render('editSection', {
                        title: "Epic Story - Build Your Story",
                        content: story.departure,
                        desc: [{
                            "title": "What is the Departure?",
                            "text": "The departure involves the hero leaving the world that they are familiar with. There are several components involved in this, not all of which may present in any one story. Below are some of the typical components you can draw from to make your story."
                        }],
                        example: [{
                            "title": "The Call to Adventure",
                            "text": "The call to adventure is the point in a person's life when their life is disrupted by some external event. Usually used to introduce the main characters, and setup the path to leave their known world."
                        }, {
                            "title": "Refusal of the Call",
                            "text": "After a call to adventure is given, the hero for one reason or another will refuse it.",
                        }, {
                            "title": "Supernatural Aid",
                            "text": "After the hero has made a commitment to the quest, they usually gain a mentor, or guide for the quest. This is not always immediate.",
                        }, {
                            "title": "The Crossing of the First Threshold",
                            "text": "At this point in the story, the hero crosses into the adventure itself. This means leaving the world they came from behind them. The new realm that they are in is often full of unkown rules and limits.",
                        }, {
                            "title": "The Belly of the Whale",
                            "text": "The heroe enters the first part of the adventure to contain danger. This may also be the lowest point in the story for the hero, as they realize they are not as ready as they thought for their quest.",
                        }]
                    });
                }
                else if (type == "initiation") {
                    res.render('editSection', {
                        title: "Epic Story - Build Your Story",
                        content: story.initiation,
                        desc: [{
                            "title": "What is Initiation?",
                            "text": "Different trials or temptations will strengthen the hero in this section of the story. They will emerge the true character they are meant to be. Below are some typical types of events that happen during this stage."
                        }],
                        example: [{
                            "title": "The Road of Trials",
                            "text": "This is the stage that tests the hero to start their transformation. They are often failed, but when completed they may also be rewarded for their efforts. This is also a common area to extend the story and build tension. Lots of character development can happen here."
                        }, {
                            "title": "The Meeting with the Goddess",
                            "text": "Often on the Road of Trials, the hero may meet a female figure with whom they experience an ultimate love for. This may also be an inner realization insead of directed towards a different female figure. "
                        }, {
                            "title": "Woman as the Temptress",
                            "text": "During the trials of the hero, they might encounter a temptation that would lead them off of their path. While giving in to this temptation would give momentary relief from their troubles, it would also make the hero a failure, and possibly prevent the hero from finishing the quest."
                        }, {
                            "title": "Atonement with the Father",
                            "text": "The hero may come up against a 'father figure' who must be confronted. This is not always a person, and can be anything thing in the hero's life. Often it is what holds ultimate power in their life. Often this confrontation comes in the form of a battle, in which the powerful figure must be beaten to proceed."
                        }, {
                            "title": "Apotheosis",
                            "text": "The Apotheosis is where the hero will transcend into a higher form. Often times this is a period of rest, or fulfillment. This arms the hero with new knowledge, skill, or courage to complete the adventure.",
                        }, {
                            "title": "The Ultimate Boom",
                            "text": "This is the climax portion of the story. it is the achievement of the quest, and what the hero set out to do. Everything else leads up to this point in the story, right before the return."
                        }]
                    });
                }
                else if (type == "return") {
                    res.render('editSection', {
                        title: "Epic Story - Build Your Story",
                        content: story.theReturn,
                        desc: [{
                            "title": "What is the Return?",
                            "text": "The Return is the step where the hero gets to cross the threshold back into what was previously known by them. This usually has its own complications to go along with it."
                        }],
                        example: [{
                            "title": "Refusal of the Return",
                            "text": "This is when the hero has found their enlightenment from the Ultimate Boon, and are enjoying the current world around them. Returing to their old life may seem like it would be too dull."
                        }, {
                            "title": "Magic Flight",
                            "text": "In some cases, the hero must escape with the Ultimate Boom. If this is the case, the return trip can also be dangerous."
                        }, {
                            "title": "Rescue From Without",
                            "text": "The hero is rescued from an unexpected source from some final battle, injury, or some type of harm. The rescuer is usually someone who had left earlier in the story, or may even be divine. "
                        }, {
                            "title": "Crossing of the Return Threshold",
                            "text": "Finally the hero returns home, safe from whatever challenges they have faced. Crossing the threshold may be difficult, and might involve a final fight."
                        }, {
                            "title": "Master of the Two Worlds",
                            "text": "For an average hero, this means being able to balance between the two different sections of their lives. They are the masters of their domestic and alien worlds. They can move freely between the two without further trails."
                        }, {
                            "title": "Freedom to Live",
                            "text": "Since all of the trials that were in front of the hero have now passed, they are free to live how they choose. They no longer fear death, the past, or their future. This allows them to live in the moment and pick what they do with the rest of their life."
                        }]
                    });
                }
                else {
                    res.redirect('/dash');
                }
            });
        }
        else {
            return res.redirect('/login');
        }
    });

    //######
    //End Story Routes
    //######

    router.use(function(req, res) {
        console.warn('404 Not Found: %s', req.originalUrl);
        res.status(404).render('404', {
            title: "404 Error - Page Not Found",
            notification: {
                severity: "error",
                message: "Hey I couldn't find that page, sorry."
            }
        });
    });
    // server errors
    router.use(function(err, req, res, next) {
        console.log(err.stack);
        res.status(500).render('500', {
            title: "500 Error - Server Error",
            notification: {
                severity: "error",
                message: "Something is very wrong on our side. Try again later."
            }
        });
    });


    return router;
}