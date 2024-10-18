const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');


router.post('/', async (req, res) => {
    const { patientName, doctorName, date, time } = req.body;

    // Validate the required fields
    if (!patientName || !doctorName || !date || !time) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Find the patient by name
        const patient = await Patient.findOne({
            $or: [
                { first_name: { $regex: patientName, $options: 'i' } },
                { last_name: { $regex: patientName, $options: 'i' } }
            ]
        });

        // Find the doctor by name
        const doctor = await Doctor.findOne({
            $or: [
                { first_name: { $regex: doctorName, $options: 'i' } },
                { last_name: { $regex: doctorName, $options: 'i' } }
            ]
        });

        // Check if patient and doctor exist
        if (!patient || !doctor) {
            return res.status(404).json({ message: 'Patient or doctor not found.' });
        }

        // Create the appointment
        const appointment = new Appointment({
            patient: patient._id,
            doctor: doctor._id,   
            date,
            time
        });

        const savedAppointment = await appointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patient doctor');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET appointments by patient name
router.get('/search', async (req, res) => {
    const { name } = req.query; 

    if (typeof name !== 'string') {
        return res.status(400).json({ message: 'Search term must be a string.' });
    }

    try {
        const patients = await Patient.find({
            $or: [
                { first_name: { $regex: name, $options: 'i' } },
                { last_name: { $regex: name, $options: 'i' } }
            ]
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
