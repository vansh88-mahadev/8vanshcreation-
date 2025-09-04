// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (change URI accordingly)
mongoose.connect('mongodb://localhost:27017/poetrySite', { useNewUrlParser: true, useUnifiedTopology: true });

const thoughtSchema = new mongoose.Schema({
  text: String,
  approved: { type: Boolean, default: false }, // only approved thoughts are shown
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Get approved thoughts
app.get('/api/thoughts', async (req, res) => {
  const thoughts = await Thought.find({ approved: true }).sort({ _id: -1 });
  res.json(thoughts);
});

// Submit new thought (default: not approved)
app.post('/api/thoughts', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const thought = new Thought({ text, approved: false });
  await thought.save();
  res.json({ message: 'Submitted for approval' });
});

// Admin endpoints (simplified auth example)
const ADMIN_KEY = 'YOUR_ADMIN_SECRET_KEY';

// Get all thoughts (for admin)
app.get('/api/admin/thoughts', async (req, res) => {
  if (req.headers.authorization !== ADMIN_KEY) return res.status(403).send('Forbidden');
  const thoughts = await Thought.find().sort({ _id: -1 });
  res.json(thoughts);
});

// Approve thought
app.post('/api/admin/thoughts/:id/approve', async (req, res) => {
  if (req.headers.authorization !== ADMIN_KEY) return res.status(403).send('Forbidden');
  await Thought.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: 'Thought approved' });
});

// Delete thought
app.delete('/api/admin/thoughts/:id', async (req, res) => {
  if (req.headers.authorization !== ADMIN_KEY) return res.status(403).send('Forbidden');
  await Thought.findByIdAndDelete(req.params.id);
  res.json({ message: 'Thought deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
