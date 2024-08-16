require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase', // Provide a default URI if not set
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret', // Provide a default secret for development
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000', // URL of your frontend
};
