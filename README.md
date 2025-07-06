# Multifly Travel

A modern, responsive user website template designed to streamline administrative tasks and provide an intuitive interface for managing web applications, services, or data workflows. This project offers a clean and customizable solution for developers to build feature-rich dashboards with ease.

### Amadeus for Developer

- URL: s://developers.amadeus.com/

  1.Using this above url first click on register button and register yourself
  ![alt text](<../MULTIFLY-App/User_Backend/uploads/Screenshot 2025-06-27 152701-1.png>)

  2.This is registration form fill this properly
  ![alt text](<Screenshot 2025-06-27 152721-1.png>)

  3.After complete your registration you get the mail for confirm password
  ![alt text](<Screenshot 2025-06-27 223255.png>)

  4.Sign In your register email and password
  ![alt text](<Screenshot 2025-06-27 223351.png>)

  5.Go on your profile icon in there self-service workshop option click on they provide you keys for test environment
  ![alt text](<Screenshot 2025-06-27 223603.png>)

  6.After go to My App in there create the app for keys
  ![alt text](<Screenshot 2025-06-27 223751.png>)

  7.Fill the app name,B2C /B2B and description (optional) then create app
  ![alt text](<Screenshot 2025-06-27 223826.png>)

  8.Now created the your anadeus API key and secrte key
  ![alt text](<Screenshot 2025-06-27 223858.png>)

## Table of Contents

- Introduction
- Features
- Technologies
- Installation
- Folder Structure
- API Endpoints
- Usage
- Contributing

### Introduction

The Multifly travel website is a free and open-source template built to provide a user-friendly interface for managing backend systems. It includes a variety of components and layouts suitable for web applications, e-commerce platforms, or data management systems. With a focus on responsiveness and customization, this dashboard is ideal for developers looking to create professional admin panels quickly.

### Features

- Responsive Design: Fully responsive layout that adapts to all screen sizes, from mobile to desktop.
- Modular Components: Reusable UI components like charts, tables, forms, and cards.
- Customizable Themes: CSS variables for easy theming and styling adjustments.
- User Management: Interface for managing users, roles, and permissions (if applicable).
- Data Visualization: Integration with charting libraries for displaying data insights.
- Cross-Browser Compatibility: Works seamlessly across modern browsers.

### Technologies

Frontend:
Reactjs
JavaScript (ES6+)
Tailwind CSS

Backend (if applicable):
Node.js (with Express.js for API, if included)
RESTful API

Build Tools:
npm (for dependency management)

Libraries (optional, based on common dashboard setups):
Chart.js or ApexCharts for data visualization
jQuery (if used for DOM manipulation)

Version Control:
Git

### Installation

Follow these steps to set up the project locally:

Clone the Repository:
git clone s://github.com/Pratiksha-Bhise23/admin_dashboard.git
cd admin_dashboard

Install Dependencies:
npm install

Start the Development Server:
npm start

The application will be available at ://localhost:5000 (port may vary).

Build for Production:
npm run build

The optimized build will be available in the dist/ directory.

## API Reference

### Authentication APIs (`/api/user`)

#### Login
```
  POST /api/user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `phone`   | `string` | **Required**. User's phone number |

**Description**: Initiates login by sending an OTP to the provided phone number and email (if user exists). Returns a registration prompt if the phone number is not found.

**Response**:

- If user exists: `{ status: "otp_sent", message: "OTP sent to phone and email", phone }`
- If user does not exist: `{ status: "register", message: "Phone not found, please register", phone }`
- Error: `{ error: "Phone number is required" }` or `{ error: "Server error" }`

---

#### Register

```
  POST /api/user/register
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Required**. User's full name     |
| `email`   | `string` | **Required**. User's email address |

**Description**: Registers a new user with name and email, sending an OTP to the email for verification.

**Response**:

- Success: `{ status: "otp_sent", message: "OTP sent to email", email }`
- Error: `{ error: "Name and email are required" }`, `{ error: "Email already exists" }`, or `{ error: "Server error" }`

---

#### Verify OTP

```
  POST /api/user/verify-otp
```

| Parameter | Type     | Description                                          |
| :-------- | :------- | :--------------------------------------------------- |
| `otp`     | `string` | **Required**. One-time password                      |
| `phone`   | `string` | **Optional**. User's phone number (if login)         |
| `email`   | `string` | **Optional**. User's email address (if registration) |

**Description**: Verifies the OTP for login or registration. Updates phone number if provided and not already set. Returns a JWT session token upon successful verification.

**Response**:

- Success: `{ status: "verified", message: "OTP verified successfully", phone, email, session_id }`
- Error: `{ error: "OTP and either phone or email are required" }`, `{ error: "User not found" }`, `{ error: "Invalid or expired OTP" }`, or `{ error: "Server error" }`

---

#### Logout

```
  POST /api/user/logout
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token |

**Description**: Logs out the user (client-side token invalidation).

**Response**:

- Success: `{ status: "success", message: "Logged out successfully" }`

---

### Flight APIs (`/api`)

#### Search Flights

```
  GET /api/flights/search
```

| Parameter     | Type     | Description                               |
| :------------ | :------- | :---------------------------------------- |
| `origin`      | `string` | **Required**. IATA code of origin         |
| `destination` | `string` | **Required**. IATA code of destination    |
| `date`        | `string` | **Required**. Departure date (YYYY-MM-DD) |
| `returnDate`  | `string` | **Optional**. Return date (YYYY-MM-DD)    |

**Description**: Searches for flight offers using the Amadeus API, enriching results with airline names.

**Response**:

- Success: `{ status: "success", flights: [...] }`
- Error: `{ error: "Origin, destination, and departure date are required" }` or `{ error: "Failed to search flights", details: "..." }`

---

#### Price Flight

```
  POST /api/flights/price
```

| Parameter     | Type     | Description                                   |
| :------------ | :------- | :-------------------------------------------- |
| `flightOffer` | `object` | **Required**. Flight offer object from search |

**Description**: Confirms pricing for a selected flight offer using the Amadeus API, including airline details.

**Response**:

- Success: `{ status: "success", pricedOffer: {...} }`
- Error: `{ error: "Flight offer is required" }` or `{ error: "Failed to price flight", details: "..." }`

---

#### Live Airport Search

```
  GET /api/flights/live-airport-search
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `term`    | `string` | **Required**. Search term for airport/city |

**Description**: Searches for airports and cities based on a keyword using the Amadeus API.

**Response**:

- Success: `[ { label: "Name (IATA) - DetailedName", value: "IATA" }, ... ]`
- Error: `{ error: "Search term is required" }` or `{ error: "Failed to search airports", details: "..." }`

---

#### Seat Map

```
  POST /api/flights/seatmap
```

| Parameter     | Type     | Description                               |
| :------------ | :------- | :---------------------------------------- |
| `pricedOffer` | `object` | **Required**. Priced flight offer with ID |

**Description**: Retrieves the seat map for a priced flight offer using the Amadeus API or a fallback  request.

**Response**:

- Success: `{ status: "success", seatMaps: [...] }`
- Error: `{ error: "Priced flight offer is required" }`, `{ error: "Priced offer must include an ID" }`, or `{ error: "Failed to retrieve seat map", details: "..." }`

---

#### Book Flight

```
  POST /api/flights/book
```

| Parameter       | Type     | Description                                 |
| :-------------- | :------- | :------------------------------------------ |
| `Authorization` | `string` | **Required**. Bearer JWT token              |
| `pricedOffer`   | `object` | **Required**. Priced flight offer with ID   |
| `travelers`     | `array`  | **Required**. Array of traveler details     |
| `addons`        | `object` | **Optional**. Add-ons (seat, baggage, etc.) |
| `gstin`         | `string` | **Optional**. GSTIN number                  |

**Description**: Initiates a flight booking, creates a Razorpay payment order, and stores booking details in the database with a pending status.

**Response**:

- Success: `{ status: "payment_required", paymentOrder: {...}, bookingId: "...", totalPrice: "...", breakdown: {...} }`
- Error: `{ error: "Priced flight offer with ID is required" }`, `{ error: "Traveler information is required" }`, or `{ error: "Failed to create payment order", details: "..." }`

---

#### Confirm Booking

```
  POST /api/flights/confirm-booking
```

| Parameter       | Type     | Description                              |
| :-------------- | :------- | :--------------------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token           |
| `paymentId`     | `string` | **Required**. Razorpay payment ID        |
| `orderId`       | `string` | **Required**. Razorpay order ID          |
| `signature`     | `string` | **Required**. Razorpay signature         |
| `pricedOffer`   | `object` | **Required**. Priced flight offer        |
| `travelers`     | `array`  | **Required**. Array of traveler details  |
| `bookingId`     | `string` | **Required**. Booking ID from bookFlight |

**Description**: Verifies payment signature, creates a booking with Amadeus, and updates the booking status to confirmed in the database.

**Response**:

- Success: `{ status: "success", message: "Flight booked successfully", booking: {...} }`
- Error: `{ error: "Unauthorized access" }`, `{ error: "All payment, booking, and traveler details are required" }`, `{ error: "Invalid payment signature" }`, or `{ error: "Failed to confirm booking", details: "..." }`

---

#### Get Bookings

```
  GET /api/bookings
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token |

**Description**: Retrieves all bookings for the authenticated user, including Amadeus booking details.

**Response**:

- Success: `{ status: "success", bookings: [...] }`
- Error: `{ error: "Failed to fetch bookings", details: "..." }`

---

#### Get Booking By ID

```
  GET /api/bookings/:amadeusOrderId
```

| Parameter        | Type     | Description                    |
| :--------------- | :------- | :----------------------------- |
| `Authorization`  | `string` | **Required**. Bearer JWT token |
| `amadeusOrderId` | `string` | **Required**. Amadeus order ID |

**Description**: Retrieves details of a specific booking by Amadeus order ID.

**Response**:

- Success: `{ status: "success", booking: {...} }`
- Error: `{ error: "Booking not found" }` or `{ error: "Failed to fetch booking", details: "..." }`

---

#### Cancel Booking

```
  DELETE /api/bookings/:amadeusOrderId/cancel
```

| Parameter        | Type     | Description                    |
| :--------------- | :------- | :----------------------------- |
| `Authorization`  | `string` | **Required**. Bearer JWT token |
| `amadeusOrderId` | `string` | **Required**. Amadeus order ID |

**Description**: Cancels a booking using the Amadeus API and updates the status to cancelled in the database.

**Response**:

- Success: `{ status: "success", message: "Booking cancelled successfully" }`
- Error: `{ error: "Booking not found" }` or `{ error: "Failed to cancel booking", details: "..." }`

---

#### Get Invoice

```
  GET /api/bookings/:amadeusOrderId/invoice
```

| Parameter        | Type     | Description                    |
| :--------------- | :------- | :----------------------------- |
| `Authorization`  | `string` | **Required**. Bearer JWT token |
| `amadeusOrderId` | `string` | **Required**. Amadeus order ID |

**Description**: Generates an invoice for a specific booking, including booking and user details.

**Response**:

- Success: Invoice file (handled by `generateInvoice` service)
- Error: `{ error: "Unauthorized. No user found in token." }`, `{ error: "Booking not found" }`, or `{ error: "Failed to generate invoice", details: "..." }`

---

### Master Data APIs (`/api`)

#### Create Traveler

```
  POST /api/travelers
```

| Parameter       | Type     | Description                                    |
| :-------------- | :------- | :--------------------------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token                 |
| `first_name`    | `string` | **Required**. Traveler's first name            |
| `last_name`     | `string` | **Required**. Traveler's last name             |
| `prefix`        | `string` | **Optional**. Traveler's prefix (e.g., Mr, Ms) |

**Description**: Creates a new traveler profile for the authenticated user (max 5 travelers).

**Response**:

- Success: `{ status: "success", message: "Traveler created successfully", traveler: {...} }`
- Error: `{ error: "First name and last name are required" }`, `{ error: "Maximum limit of 5 travelers reached" }`, or `{ error: "Server error" }`

---

#### Get Travelers

```
  GET /api/travelers
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token |

**Description**: Retrieves all traveler profiles for the authenticated user.

**Response**:

- Success: `{ status: "success", travelers: [...] }`
- Error: `{ error: "Server error" }`

---

#### Get Traveler

```
  GET /api/travelers/:id
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token |
| `id`            | `string` | **Required**. Traveler ID      |

**Description**: Retrieves a specific traveler profile by ID for the authenticated user.

**Response**:

- Success: `{ status: "success", traveler: {...} }`
- Error: `{ error: "Traveler not found" }` or `{ error: "Server error" }`

---

#### Update Traveler

```
  PUT /api/travelers/:id
```

| Parameter       | Type     | Description                         |
| :-------------- | :------- | :---------------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token      |
| `id`            | `string` | **Required**. Traveler ID           |
| `first_name`    | `string` | **Optional**. Traveler's first name |
| `last_name`     | `string` | **Optional**. Traveler's last name  |
| `prefix`        | `string` | **Optional**. Traveler's prefix     |

**Description**: Updates a traveler profile for the authenticated user.

**Response**:

- Success: `{ status: "success", message: "Traveler updated successfully", traveler: {...} }`
- Error: `{ error: "Traveler not found" }` or `{ error: "Server error" }`

---

#### Delete Traveler

```
  DELETE /api/travelers/:id
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `Authorization` | `string` | **Required**. Bearer JWT token |
| `id`            | `string` | **Required**. Traveler ID      |

**Description**: Deletes a traveler profile for the authenticated user.

**Response**:

- Success: `{ status: "success", message: "Traveler deleted successfully" }`
- Error: `{ error: "Traveler not found" }` or `{ error: "Server error" }`

---

### Payment APIs (Not explicitly routed in provided routes)

#### Create Payment Order

```
  POST /api/payment/create-order
```

| Parameter  | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `amount`   | `number` | **Required**. Payment amount            |
| `currency` | `string` | **Required**. Currency code (e.g., INR) |
| `receipt`  | `string` | **Required**. Receipt identifier        |

**Description**: Creates a Razorpay payment order for a specified amount and currency.

**Response**:

- Success: `{ status: "success", paymentOrder: {...} }`
- Error: `{ error: "Invalid amount" }`, `{ error: "Currency and receipt are required" }`, or `{ error: "Failed to create payment order", details: "..." }`

---

#### Verify Payment

```
  POST /api/payment/verify
```

| Parameter   | Type     | Description                       |
| :---------- | :------- | :-------------------------------- |
| `orderId`   | `string` | **Required**. Razorpay order ID   |
| `paymentId` | `string` | **Required**. Razorpay payment ID |
| `signature` | `string` | **Required**. Razorpay signature  |

**Description**: Verifies a Razorpay payment signature and updates the booking status to confirmed.

**Response**:

- Success: `{ status: "success", message: "Payment verified and updated successfully", data: {...} }`
- Error: `{ error: "Order ID, payment ID, and signature are required" }`, `{ error: "Invalid payment signature" }`, `{ error: "Booking not found for this payment ID" }`, or `{ error: "Failed to verify payment", details: "..." }`

---

### Country APIs (`/api`)

#### Get All Countries

```
  GET /api/
```

| Parameter | Type | Description            |
| :-------- | :--- | :--------------------- |
| None      | -    | No parameters required |

**Description**: Retrieves a list of all countries with their currency details from the database.

**Response**:

- Success: `{ status: "success", countries: [...] }`
- Error: `{ error: "Failed to fetch countries", details: "..." }`

---

#### Update Country Currency

```
  PATCH /api/:name/currency
```

| Parameter         | Type     | Description                          |
| :---------------- | :------- | :----------------------------------- |
| `name`            | `string` | **Required**. Country name (path)    |
| `currency_name`   | `string` | **Required**. Currency name          |
| `currency_code`   | `string` | **Required**. 3-letter currency code |
| `currency_symbol` | `string` | **Required**. Currency symbol        |

**Description**: Updates the currency details for a specific country.

**Response**:

- Success: `{ status: "success", country: {...} }`
- Error: `{ error: "currency_name, currency_code, and currency_symbol are required" }`, `{ error: "currency_code must be exactly 3 characters" }`, `{ error: "Country '${name}' not found" }`, or `{ error: "Failed to update currency", details: "..." }`

---

#### Convert Currency

```
  POST /api/currency/convert
```

| Parameter       | Type     | Description                       |
| :-------------- | :------- | :-------------------------------- |
| `sourceCountry` | `string` | **Required**. Source country name |
| `targetCountry` | `string` | **Required**. Target country name |
| `amount`        | `number` | **Required**. Amount to convert   |

**Description**: Converts an amount from the source country's currency to the target country's currency using an exchange rate API.

**Response**:

- Success: `{ status: "success", conversion: { source: {...}, target: {...}, exchangeRate: "...", timestamp: "..." } }`
- Error: `{ error: "sourceCountry, targetCountry, and amount are required" }`, `{ error: "amount must be a positive number" }`, `{ error: "Source country '${sourceCountry}' not found" }`, `{ error: "Target country '${targetCountry}' not found" }`, or `{ error: "Failed to convert currency", details: "..." }`

---

### Notes

- **Authentication**: Protected routes (`/api/flights/book`, `/api/flights/confirm-booking`, `/api/bookings`, `/api/bookings/:amadeusOrderId`, `/api/bookings/:amadeusOrderId/cancel`, `/api/bookings/:amadeusOrderId/invoice`, `/api/travelers`, `/api/travelers/:id`, `/api/user/logout`) require a valid JWT token in the `Authorization` header (Bearer format).
- **Environment Variables**: Ensure `process.env` variables (`JWT_SECRET`, `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `EXCHANGE_RATE_API_KEY`, `PORT`) are set in `.env`.
- **Database**: Assumes a PostgreSQL database with `users`, `otps`, `bookings`, `travelers`, and `countries` tables.
- **Amadeus API**: Flight-related endpoints rely on the Amadeus API for search, pricing, seat maps, and booking.
- **Razorpay**: Payment-related functionality uses Razorpay for order creation and verification.
- **Error Handling**: All endpoints include error handling with appropriate status codes and messages.


Open the dashboard in your browser at http://localhost:5000 after running npm start.

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
