var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	projectName: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	devs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	tasks:
  [{
		taskName: String,
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		comments:
		[{
			author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      description: String
		}]
	}]
});

module.exports = mongoose.model('Project', projectSchema);
