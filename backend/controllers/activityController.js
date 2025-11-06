const Activity = require('../models/Activity');

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ userID: req.query.id });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(200).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getActivities,
    createActivity
};