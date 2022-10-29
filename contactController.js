// contactController.js
// Import contact model
Contact = require('./contactModel');
// Handle index actions
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: contacts
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    if (!req.body.hasOwnProperty('phone') || !req.body.hasOwnProperty('email')) {
        res.json({
            message: 'Email and Phone should not be empty!',
            data: contact
        })
        return
    } 
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
// save the contact and check for errors
    contact.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New contact created!',
            data: contact
        });
    });
};
// Handle view contact info
exports.view = function (req, res) {
    Contact.find({name : req.params.name}, function (err, contacts) {
        if (err) {
            res.send(err);
            return
        }
        else {
            res.json({
                message: 'Contact details loading..',
                data: contacts
            });
        }
    })
};
// Handle update contact info
exports.update = function (req, res) {
    console.log("HELLO!!!")
    Contact.find({name : req.params.name}, function (err, contact) {
        if (err) {
            res.send(err);
            return
        }
        else {
            Contact.updateOne({
                name: req.params.name,
                gender: req.body.gender,
                email: req.body.email,
                phone : req.body.phone
            }, function (err) {
                contact.name =  req.params.name,
                contact.gender = req.body.gender,
                contact.email = req.body.email,
                contact.phone = req.body.phone
                res.json({
                    message: 'Contact Info updated',
                    data: contact
                });
            })
        }
    })
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.remove({
        name: req.params.name
    }, function (err, contact) {
        if (err) {
            res.send(err);
            return
        }
        res.json({
                status: "success",
                message: 'Contact deleted'
            });
        });
};
