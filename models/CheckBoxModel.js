const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CheckBoxModel = new Schema({
    checkbox: {
        type: String
    },
},
 {
        collection: 'checkboxes'
    });


module.exports = mongoose.model('CheckboxModel', CheckBoxModel);