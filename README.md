# MAIDAN Frontend

## Overview
**MAIDAN** is a sports venue booking and matchmaking frontend application built with React, Vite, and Tailwind CSS. It allows sports enthusiasts to discover sports facilities, reserve conflict-free hourly time slots, organize interactive team lineups, invite friends to matches, browse open challenges, follow other players, and manage administrative settings.

## Live Application
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`
- **Backend Repository:** [MAIDAN Backend](../project-3-backend)

## Screenshots
*(Add application screenshots here)*

## Technologies Used
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Material UI (MUI)
- Dayjs & Date-fns
- React Big Calendar

## Features
- User registration and login with persistent authentication
- Protected routes for authenticated users and admin routes for managers
- Venue search and filtering by sport type and location
- Dynamic slot availability calendar and interactive checkout
- Interactive tactics pitch visualization (`Formation.jsx`) for placing players into custom positions
- Auto-balancing groups into Team A and Team B
- Challenge Arena for posting and accepting open match challenges
- Friend invitations, follower network, and notifications drawer
- Admin control panel for managing venues, users, and global bookings

## Project Structure
```
src/
├── assets/
├── components/
├── context/
├── pages/
├── services/
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

## Getting Started

### Prerequisites
Install the following before running the project:
- Node.js (v18.x or higher)
- The backend API has to be working: [MAIDAN Backend API](../project-3-backend/README.md)

### Installation
1. **Clone the repository / navigate to frontend directory:**
   ```bash
   cd project-3-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create the environment file:**
   Create a `.env` file in the root directory:
   ```env
   VITE_BACK_END_SERVER_URL=http://localhost:3000
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Go to: `http://localhost:5173`

## Application Routes
| Route | Page | Access |
| :--- | :--- | :--- |
| `/` | Home page | Public |
| `/sign-in` | Sign In page | Public |
| `/sign-up` | Sign Up page | Public |
| `/venues` | Venue list | Public |
| `/venues/:venueId` | Venue details | Public |
| `/my-profile` | User profile & match history | Authenticated |
| `/profile/:id` | Other user profile details | Authenticated |
| `/venues/bookings/:id` | Booking page | Authenticated |
| `/bookings/:id` | Booking details | Authenticated |
| `/admin` | Admin dashboard | Admin |
| `/admin/venues/create` | Create venue | Admin |
| `/admin/venues/:id` | Admin venue details | Admin |
| `/admin/venues/:venueId/edit` | Edit venue | Admin |

## User Stories
1. **Users can filter sports venues** by sport type and location to quickly find available facilities.
2. **Users can view detailed venue information** including hourly rates, images, and descriptions to choose the best facility.
3. **Administrators can add new sports venues** to the database to keep location data up-to-date.
4. **Users can reserve specific hourly time slots** at venues with backend conflict validation to prevent double-booking.
5. **Organizers can invite registered friends** to their sessions so participants can view booking details on their dashboards.
6. **Organizers can randomly and evenly split groups** into Team A and Team B to set up fair matches effortlessly.
7. **Users can edit and save player lineups** and team rosters to ensure everyone knows their placement before the game.
8. **Registered users can view a chronological history** of past games alongside upcoming active bookings to track their athletic activity.
9. **Team leaders can post open match challenges** specifying the venue, sport, date, and time slot to find opposing teams.
10. **Players can browse the Challenge Arena board** to view open requests from other teams looking for matches.
11. **Opposing team captains can accept open match challenges** with a single click to automatically match teams and lock in venue reservations.

## Future Enhancements
- Interactive map view for location-based venue search.
- Pre-match chat room between competing team leaders.
- Light/Dark theme switcher.

## Team Members
| Name | GitHub |
| :--- | :--- |
| Ali Alsaeed | [GitHub Profile](https://github.com/) |

## Credits
- General Assembly Software Engineering Bootcamp
