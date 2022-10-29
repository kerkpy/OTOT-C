var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    role: {
        type: String
    }, 
    token: {
        type: String,
        default: null
    }
});
// Export Contact model
var User = module.exports = mongoose.model('user', userSchema);