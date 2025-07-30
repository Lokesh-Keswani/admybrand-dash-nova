# MongoDB Setup Guide for ADmyBRAND Authentication

## Prerequisites

1. **Install MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download and install MongoDB Community Server for Windows
   - During installation, choose "Complete" setup
   - Install MongoDB as a Service (recommended)

2. **Verify MongoDB Installation**
   ```bash
   # Open Command Prompt or PowerShell as Administrator
   mongod --version
   ```

## Quick Setup (Recommended)

### Option 1: MongoDB Compass (GUI)
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Open MongoDB Compass
3. Connect to: `mongodb://localhost:27017`
4. Create database: `admybrand`

### Option 2: Command Line
```bash
# Start MongoDB service (if not running)
net start MongoDB

# Connect to MongoDB shell
mongosh

# Create database and collection
use admybrand
db.users.insertOne({test: "database created"})
```

## Environment Configuration

The backend is configured to use:
- **Database URL**: `mongodb://localhost:27017/admybrand`
- **Default Port**: 27017
- **Database Name**: admybrand

You can modify these settings in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/admybrand
```

## Demo User Account

The system automatically creates a demo user on first startup:

- **Email**: demo@admybrand.com
- **Password**: demo123
- **Role**: Admin

## Starting the Backend

1. Make sure MongoDB is running
2. Navigate to backend directory
3. Run the server:
   ```bash
   npm start
   ```

The backend will:
- ✅ Connect to MongoDB
- ✅ Create the demo user (if it doesn't exist)
- ✅ Start the API server on port 3001

## Troubleshooting

### MongoDB Connection Issues
1. **Service not running**: 
   ```bash
   net start MongoDB
   ```

2. **Port already in use**:
   - Check if another MongoDB instance is running
   - Change port in .env file

3. **Permission issues**:
   - Run Command Prompt as Administrator
   - Check MongoDB service status in Services app

### Database Issues
1. **Database not created**: 
   - MongoDB creates databases automatically when first document is inserted
   - The demo user creation will trigger database creation

2. **Authentication errors**:
   - Check JWT_SECRET in .env file
   - Ensure frontend is pointing to correct backend URL

## Security Notes

⚠️ **For Production:**
- Change JWT_SECRET in .env
- Use MongoDB Atlas or secured MongoDB instance
- Enable MongoDB authentication
- Use environment-specific configuration

## Checking Everything Works

1. Start MongoDB service
2. Start backend: `npm start`
3. Check console output for:
   ```
   ✅ MongoDB Connected: localhost
   ✅ Demo user created: demo@admybrand.com / demo123
   🚀 ADmyBRAND Analytics API Server running on port 3001
   ```

4. Test authentication:
   ```bash
   # Login test
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@admybrand.com","password":"demo123"}'
   ```

Now you're ready to use real authentication with MongoDB! 🎉 