require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (you'll need to set up MongoDB)
// For now, we'll use in-memory storage for demo
// To use MongoDB, uncomment and set up MongoDB Atlas

// In-memory user storage (replace with MongoDB later)
const users = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Content APIs configuration
const CONTENT_SOURCES = {
  books: [
    'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10',
    'https://openlibrary.org/subjects/love.json?limit=10'
  ],
  science: [
    'https://api.spaceflightnewsapi.net/v4/articles/?limit=10',
    'https://api.nasa.gov/planetary/apod?count=5'
  ],
  music: [
    'https://musicbrainz.org/ws/2/artist?query=rock&fmt=json&limit=10'
  ],
  movies: [
    'https://api.themoviedb.org/3/movie/popular?api_key=YOUR_TMDB_KEY&language=en-US&page=1'
  ],
  news: [
    'https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWS_API_KEY'
  ]
};

// Helper: Fetch content from external APIs based on interest
async function fetchContentForInterest(interest, limit = 3) {
  try {
    const sources = CONTENT_SOURCES[interest];
    if (!sources || sources.length === 0) {
      return getFallbackContent(interest);
    }
    
    const source = sources[Math.floor(Math.random() * sources.length)];
    const response = await axios.get(source, { timeout: 5000 });
    
    // Parse different API responses
    let items = [];
    
    if (source.includes('books.googleapis.com')) {
      items = response.data.items?.slice(0, limit).map(item => ({
        title: item.volumeInfo.title,
        description: item.volumeInfo.description?.substring(0, 100) || 'No description',
        link: item.volumeInfo.infoLink,
        source: 'Google Books'
      }));
    } else if (source.includes('openlibrary.org')) {
      items = response.data.docs?.slice(0, limit).map(doc => ({
        title: doc.title,
        description: doc.subtitle || 'A book you might enjoy',
        link: `https://openlibrary.org${doc.key}`,
        source: 'Open Library'
      }));
    } else if (source.includes('spaceflightnewsapi')) {
      items = response.data.results?.slice(0, limit).map(article => ({
        title: article.title,
        description: article.summary?.substring(0, 150) || 'Space news update',
        link: article.url,
        source: 'Spaceflight News'
      }));
    }
    
    return items.length > 0 ? items : getFallbackContent(interest);
  } catch (error) {
    console.error(`Error fetching content for ${interest}:`, error.message);
    return getFallbackContent(interest);
  }
}

// Fallback content when APIs fail
function getFallbackContent(interest) {
  const fallback = {
    books: [
      { title: "The Midnight Library by Matt Haig", description: "A novel about the choices we make", link: "https://www.goodreads.com/book/show/52578297-the-midnight-library" },
      { title: "Atomic Habits by James Clear", description: "Tiny changes, remarkable results", link: "https://jamesclear.com/atomic-habits" },
      { title: "Project Hail Mary by Andy Weir", description: "A sci-fi adventure", link: "https://www.goodreads.com/book/show/54493401-project-hail-mary" }
    ],
    science: [
      { title: "Latest Space Discovery", description: "New exoplanet found in habitable zone", link: "https://www.nasa.gov/news" },
      { title: "Quantum Computing Breakthrough", description: "Scientists achieve new milestone", link: "https://www.sciencedaily.com/news/computers_math/quantum_computers/" },
      { title: "Climate Change Update", description: "2024 temperature records", link: "https://climate.nasa.gov/" }
    ],
    music: [
      { title: "New Album Releases", description: "Check out what's new this week", link: "https://pitchfork.com/reviews/albums/" },
      { title: "Artist Spotlight", description: "Discover emerging talents", link: "https://www.npr.org/sections/allsongs/" },
      { title: "Music Theory Basics", description: "Learn something new", link: "https://www.musictheory.net/" }
    ],
    default: [
      { title: "Explore Something New", description: "Discover content tailored to you", link: "#" },
      { title: "Trending Now", description: "What people are reading", link: "#" }
    ]
  };
  
  return fallback[interest] || fallback.default;
}

// ============ USER AUTHENTICATION APIs ============

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      interests: [],
      preferences: {}
    };
    
    users.push(user);
    
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, username, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// Save user interests
app.post('/api/user/interests', authenticateToken, async (req, res) => {
  const { interests } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  
  if (user) {
    user.interests = interests;
    res.json({ message: 'Interests saved', interests });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get user data
app.get('/api/user/data', authenticateToken, async (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
      interests: user.interests,
      preferences: user.preferences
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get dynamic content based on interests
app.post('/api/content/recommendations', authenticateToken, async (req, res) => {
  const { interests } = req.body;
  
  if (!interests || interests.length === 0) {
    return res.json([]);
  }
  
  try {
    const recommendations = [];
    const shuffledInterests = [...interests].sort(() => 0.5 - Math.random());
    const selectedInterests = shuffledInterests.slice(0, 5);
    
    for (const interest of selectedInterests) {
      const content = await fetchContentForInterest(interest, 2);
      recommendations.push(...content.map(item => ({
        ...item,
        category: interest,
        icon: getIconForInterest(interest)
      })));
    }
    
    // Shuffle final results
    const shuffledResults = recommendations.sort(() => 0.5 - Math.random());
    res.json(shuffledResults.slice(0, 9));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Helper function for icons
function getIconForInterest(interest) {
  const icons = {
    books: '📚',
    games: '🎮',
    movies: '🎬',
    music: '🎵',
    science: '🔭',
    cooking: '🍳',
    art: '🎨',
    fitness: '💪',
    coding: '💻',
    travel: '✈️',
    default: '📖'
  };
  return icons[interest] || icons.default;
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
