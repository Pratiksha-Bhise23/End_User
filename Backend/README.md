//Install dependency
npm i bcrypt body-parser cors dotenv email-validator express express-session expression jsonwebtoken multer nodemailer pg soap express-rate-limit


//Command to Generate Bcrypt Hash in the Terminal
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"


//Generate a Random JWT Secret Key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


//.env
PORT=3000
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=auth_db
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
AMADEUS_API_KEY=ncauX2GvGKjPAoaGi0ns8wj73Y8j3gbo
AMADEUS_API_SECRET=1UG5NDT4bzF0T8NM


// CREATE DATABASE Travel_agency;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'user')),
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);


master data
CREATE TABLE public.travelers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    first_name CHARACTER VARYING(50) NOT NULL,
    last_name CHARACTER VARYING(50) NOT NULL,
    prefix CHARACTER VARYING(10) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

Master data (Add User):
Method: POST
URL: http://localhost:3000/api/user/travelers
Body (JSON):

{
  "first_name": "mno",
  "last_name": "bcd",
  "prefix": "Mr"
}

Response 
{
    "status": "success",
    "message": "Traveler created successfully",
    "traveler": {
        "id": 7,
        "user_id": 29,
        "first_name": "swapnil",
        "last_name": "darwante",
        "prefix": "Mr",
        "created_at": "2025-04-17T08:17:16.317Z",
        "updated_at": "2025-04-17T08:17:16.317Z"
    }
}


Master data (Fetch User):
Method: POST
URL: http://localhost:3000/api/user/travelers


Master data (Edit User):
Method: PUT
URL: http://localhost:3000/api/user/travelers/4
HEADER: key:Authorization
        value:Bearer token
Body (JSON):

{
  "first_name": "hello",
  "prefix": "Master"
}

Response 
{
    "status": "success",
    "message": "Traveler created successfully",
    "traveler": {
        "id": 7,
        "user_id": 29,
        "first_name": "hello",
        "last_name": "darwante",
        "prefix": "Master",
        "created_at": "2025-04-17T08:17:16.317Z",
        "updated_at": "2025-04-17T08:17:16.317Z"
    }
}


Master data (Edit User):
Method: PUT
URL: http://localhost:3000/api/user/travelers/4
HEADER: key:Authorization
        value:Bearer token

Response 
{
    "status": "success",
    "message": "Traveler deleted successfully",
   
}



Login (Existing User):
Method: GET
URL: http://localhost:3000/api/user/login
Body (JSON):

{
  "phone": "1234567890"
}

Response (if phone exists in DB):
{
  "status": "otp_sent",
  "message": "OTP sent to phone",
  "phone": "1234567890"
}

Response (if phone doesn’t exist):

{
  "status": "register",
  "message": "Phone not found, please register",
  "phone": "1234567890"
}

Register (New User):
Method: POST
URL: http://localhost:3000/api/user/register
Body (JSON):
{
  "name": "Pratiksha",
  "email": "pratikshabhise87@gmail.com"
}
Response:
json

Collapse

Wrap

Copy
{
  "status": "otp_sent",
  "message": "OTP sent to email",
  "email": "pratikshabhise87@gmail.com"
}

Verify OTP (After Login):
Method: POST
URL: http://localhost:3000/api/user/verify-otp
Body (JSON):
{
  "phone": "1234567890",
  "otp": "123456" // Replace with actual OTP from console
}
Response:
{
  "status": "verified",
  "message": "OTP verified successfully",
  "phone": "1234567890",
  "email": "pratikshabhise87@gmail.com",
  "session_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Verify OTP (After Register):
Method: POST
URL: http://localhost:3000/api/user/verify-otp
Body (JSON):
{
  "email": "pratikshabhise87@gmail.com",
  "otp": "123456" // Replace with actual OTP from email
}
Response:
{
  "status": "verified",
  "message": "OTP verified successfully",
  "phone": "",
  "email": "pratikshabhise87@gmail.com",
  "session_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Logout:
Method: POST
URL: http://localhost:3000/api/user/logout
Headers: Authorization: Bearer <session_id>
Response:
{
  "status": "success",
  "message": "Logged out successfully"
}








