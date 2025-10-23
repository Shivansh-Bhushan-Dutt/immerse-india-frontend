# Travel Dashboard Frontend

A modern React-based frontend for the Travel Dashboard application, built with TypeScript and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure login and registration
- **Experience Management**: Browse, search and filter travel experiences
- **Image Gallery**: View and manage travel photos
- **Itinerary Planning**: Create and manage travel itineraries
- **Updates Feed**: Stay updated with the latest travel information
- **Admin Dashboard**: Comprehensive management tools for administrators

## 🔧 Tech Stack

- **React**: Frontend library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Modern UI component library
- **Axios**: HTTP client for API requests

## 🛠️ Local Development

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## 🌐 Deployment

### Option 1: Vercel (Recommended)

#### Using the Deployment Script

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Run the deployment script:
   - **Windows**: 
     ```powershell
     .\deploy.ps1
     ```
   - **Mac/Linux**: 
     ```bash
     chmod +x ./deploy.sh
     ./deploy.sh
     ```

#### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```

3. Configure environment variables in the Vercel dashboard:
   - `REACT_APP_API_URL`: Your Railway backend URL

### Option 2: Railway

You can also deploy the frontend to Railway alongside your backend:

1. Add a new service to your Railway project:
   ```bash
   railway add
   ```

2. Link your frontend directory:
   ```bash
   cd frontend
   railway link
   ```

3. Set environment variables:
   ```bash
   railway variables set REACT_APP_API_URL=$RAILWAY_SERVICE_API_URL
   ```

4. Deploy:
   ```bash
   railway up
   ```

## 🔗 Connecting Frontend to Backend

### Production Setup

Ensure your frontend is configured to connect to the deployed backend:

1. In the Vercel dashboard, set environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-app.up.railway.app
   ```

2. For Railway frontend deployment, use:
   ```
   REACT_APP_API_URL=https://your-railway-app.up.railway.app
   ```

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
