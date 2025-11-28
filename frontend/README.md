# Health Record System Frontend

A comprehensive health record management system built with React.js and Spring Boot for managing medical data.

## Features

- **User Authentication** - Secure login and registration
- **Dashboard** - Overview of health metrics and recent activity
- **Medical History** - Manage conditions, allergies, and procedures
- **Appointments** - Schedule and track medical appointments
- **Medications** - Track current and as-needed medications
- **Lab Results** - View and manage laboratory test results
- **Profile Management** - Update personal and insurance information

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Spring Boot with H2 Database
- **Authentication**: Simple email/password authentication
- **API**: RESTful endpoints for all health record operations

## Setup

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API endpoint:
   ```
   VITE_REACT_APP_API_URL=http://localhost:8080/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Run Spring Boot Application**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

## API Endpoints

The frontend expects the following API endpoints:

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile/{userId}` - Update user profile

### Medical Records
- `GET /medical-conditions/user/{userId}` - Get medical conditions
- `POST /medical-conditions/user/{userId}` - Create medical condition
- `PUT /medical-conditions/:id` - Update medical condition
- `DELETE /medical-conditions/:id` - Delete medical condition

### Allergies
- `GET /allergies/user/{userId}` - Get allergies
- `POST /allergies/user/{userId}` - Create allergy
- `PUT /allergies/:id` - Update allergy
- `DELETE /allergies/:id` - Delete allergy

### Appointments
- `GET /appointments/user/{userId}` - Get all appointments
- `GET /appointments/user/{userId}/upcoming` - Get upcoming appointments
- `GET /appointments/user/{userId}/past` - Get past appointments
- `POST /appointments/user/{userId}` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### Medications
- `GET /medications/user/{userId}` - Get all medications
- `GET /medications/user/{userId}/current` - Get current medications
- `GET /medications/user/{userId}/as-needed` - Get as-needed medications
- `POST /medications/user/{userId}` - Create medication
- `PUT /medications/:id` - Update medication
- `DELETE /medications/:id` - Delete medication

### Lab Results
- `GET /lab-results/user/{userId}` - Get lab results
- `POST /lab-results/user/{userId}` - Create lab result
- `PUT /lab-results/:id` - Update lab result
- `DELETE /lab-results/:id` - Delete lab result

## Authentication

The system uses simple authentication without security layers. User credentials are stored in the H2 database and tokens are managed in localStorage.

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- Authentication failures (401)
- Authorization failures (403)
- Resource not found (404)
- Server errors (500)

## Technologies Used

### Frontend
- **React.js** - Frontend framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Spring Boot** - Backend framework
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database
- **Maven** - Build tool

## Database

The application uses H2 in-memory database. You can access the H2 console at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:healthrecord`
- Username: `sa`
- Password: `password`

## Development

1. **Start Backend**: Run the Spring Boot application
2. **Start Frontend**: Run `npm run dev` in the root directory
3. **Access Application**: Open `http://localhost:5173`
4. **Create Account**: Use the signup form to create a new account
5. **Login**: Use your created credentials to access the dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.