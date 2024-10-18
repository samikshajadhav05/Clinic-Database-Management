const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); 

// GET all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific patient by ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new patient
router.post('/', async (req, res) => {
    const patient = new Patient(req.body);
    try {
        const savedPatient = await patient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT to update a patient by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(updatedPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a patient by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET patients by name (search functionality)
router.get('/search', async (req, res) => {
    const { name } = req.query; 

    if (!name) {
        return res.status(400).json({ message: "Name query parameter is required." });
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
