import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.ts';
import dashRoutes from "./routes/dashboard.ts" 
import _ from "lodash";


dotenv.config();

const app = express();
const PORT = process.env.PORT;
const IS_PRODUCTION = process.env.NODE_ENV === "production"

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dashRoutes);
// // Serve static files from frontend dist folder
// const frontendDistPath = path.join(__dirname, '/dist');
// app.use(express.static(frontendDistPath));

// // Serve React app for all non-API routes (SPA fallback)
// app.get('*', (req, res) => {
//   // Don't serve index.html for API routes
//   if (req.path.startsWith('/api/')) {
//     return res.status(404).json({
//       success: false,
//       message: 'API route not found'
//     });
//   }

  // Serve index.html for all other routes (React Router will handle routing)
//   return res.sendFile(path.join(frontendDistPath, 'index.html'));
// });

// Start server
const startServer = () => {
  try {

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
