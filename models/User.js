var mongoose = require('mongoose');
var Story = require('./Story');
var User = mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

User.plugin(require('passport-local-mongoose'));

User.methods.getStories = function(callback) {
    return Story.find({
        user_id: this._id
    }, callback);
};
User.methods.getStoryById = function(id, callback){
    return Story.findOne({
        user_id: this._id,
        _id: id
    }, callback);
};
User.methods.newStory = function() {
    var story = new Story();
    story.user_id = this._id;
    return story;
};
User.methods.removeStory = function(story, callback){
    Story.findOneAndRemove({
        _id: story._id,
        user_id: this._id
    }, callback);
};
module.exports = mongoose.model('user', User);