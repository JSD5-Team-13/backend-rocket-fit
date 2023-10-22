const express = require("express");
const router = express.Router();
const User = require("../models/users");

app.get('/api/connections', (req, res) => {
    res.json(connections);
  });
  
  // Follow a connection
  app.post('/api/follow/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const connection = connections.find((c) => c.id === id);
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
  
    connection.isFollowing = true;
    res.json(connection);
  });
  
  // Unfollow a connection
  app.post('/api/unfollow/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const connection = connections.find((c) => c.id === id);
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
  
    connection.isFollowing = false;
    res.json(connection);
  });

  module.exports = router