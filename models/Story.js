var mongoose = require('mongoose');

var sectionSchema = new mongoose.Schema({
    title: String,
    type: String,
    desc: String,
    body: String,
    subSection: [sectionSchema]
});

var storySchema = new mongoose.Schema({
   title: String,
   departure: [sectionSchema],
   initiation: [sectionSchema],
   theReturn: [sectionSchema],
   user_id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
       index: true
   }
});

var Story = mongoose.model('story', storySchema);
module.exports = Story;