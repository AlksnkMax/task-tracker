var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	projectName: String,
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	tasks:
  [{
		taskName: String,
		comments:
		[{
			author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      description: String
		}]
	}]
});

module.exports = mongoose.model('Project', projectSchema);
