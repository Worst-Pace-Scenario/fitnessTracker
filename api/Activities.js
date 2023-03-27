const express = require('express');
const { createActivity } = require("../db/index"); 
const { getAllActivities } = require("../db/index");
const { getActivityById } = require("../db/index");
const { updateActivity } = require("../db/index");

const activities = express.Router();


// GET /api/activities/:activityId/routines
activities.get('/:activityId/routines', async (req, res) => {
    try {
      const id = req.params.activityId;
      const activity = await getActivityById(id);
      if (!activity) {
        res.status(404).json({ message: `Activity with id ${id} not found` });
      } else {
        res.json(activity);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// GET /api/activities
activities.get('/', async (req, res) => {
    try {
        console.log("Starting to fetch activities")
        const allActivities = await getAllActivities();
        console.log("Finished fetching activities")
        res.send(allActivities)
    } catch (error) {
        console.log(error)
    }
})


// POST /api/activities
activities.post('/', async (req, res) => {
    try {
      const { name, description } = req.body;
      const newActivity = await createActivity({ name, description });
      res.send(newActivity);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// // PATCH /api/activities/:activityId
activities.patch('/:activityId', async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description } = req.body;
      const updatedActivity = await updateActivity({ id, name, description });
      if (updatedActivity.length === 0) {
        res.status(404).json({ message: `Activity with id ${id} not found` });
      } else {
        res.json(updatedActivity[0]);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
module.exports = activities;
