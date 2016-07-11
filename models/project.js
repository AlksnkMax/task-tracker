var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	projectName: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	devs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	tasks:
  [{
		taskName: String,
		isFinished: Boolean,
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		comments:
		[{
			author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
			date: Date
		}]
	}]
},{ versionKey: false });

module.exports = mongoose.model('Project', projectSchema);
