const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    contact_number: { type: String, required: true },
    diagnosis: { type: String } 
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
