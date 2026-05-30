# India Temple Heritage & Pilgrimage Information Portal

## Problem Statement
Pilgrims and visitors often face challenges such as:
- Difficulty finding authentic and complete temple information
- Lack of clarity on darshan timings, rituals, and festivals
- Poor visibility of pilgrimage routes and nearby facilities
- Absence of a centralized, trusted information source

## Objectives
- Create a centralized repository of temple heritage information
- Provide accurate pilgrimage and visitor-related details
- Enable location-based discovery of temples
- Promote cultural and historical awareness

## Core Modules

### Temple Information Management
- Temple name, location, and history
- Deity details and significance
- Rituals and daily pooja schedules

### Pilgrimage & Visitor Information
- Darshan timings
- Festival calendars
- Dress code and rules
- Nearby facilities (accommodation, transport)

### Search & Discovery
- State / city / deity-based search
- Popular pilgrimage circuits
- Featured temples
- Location-based discovery of temples

### Admin Management
- Content creation and updates
- Approval of temple information
- Category and region management

## User Journey Highlights
- Plans visits using provided guidelines (timings, dress code, nearby facilities)
- Users can save or share temple information (Upcoming/Planned Feature)

## Key Performance Indicators (KPIs)
- Number of temples listed
- Monthly active users
- Search success rate
- Page engagement time
- User satisfaction score

## Data Requirements & Sample Data

### Core Entities
- Temples
- Locations (State, City)
- Deities
- Rituals & Festivals
- Visitor Information

### Sample User Data
- Temple Name
- Location
- Deity
- Historical Background
- Darshan Timings
- Festivals
- Visitor Guidelines

## Assumptions & Constraints

### Assumptions
- Temple information is collected from verified sources
- Content updates are handled by admins
- Users access the platform primarily for information

### Constraints
- Web-only platform for Phase 1
- Manual content verification
- Limited real-time integrations initially

## Future Enhancements
- Online darshan and puja booking
- Donation and charity modules
- Multilingual support
- Mobile applications
- Interactive maps and pilgrimage route planning

## Technology Stack
- **Frontend:** HTML5, CSS3 (Vanilla), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with GeoJSON for spatial queries)
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a MongoDB Atlas connection string)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Accessing the Portal
- **Main Site:** `http://localhost:5000/` or open `client/index.html` locally.
- **Admin Dashboard:** Open `client/admin.html` and login to manage temples and circuits.
