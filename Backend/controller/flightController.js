
const Amadeus = require("amadeus");
const axios = require("axios");
const pool = require("../config/db");
const crypto = require("crypto");
const { generateInvoice } = require("../services/invoiceService");
const { log } = require("console");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

// Helper function to get access token (for fallback API calls)
async function getAccessToken() {
  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.access_token;
}

// Helper function to fetch seat map directly (fallback)
async function fetchSeatMap(pricedOffer) {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    "https://test.api.amadeus.com/v1/shopping/seatmaps",
    { data: [pricedOffer] },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
}

// Helper function to fetch airline details (name) by carrier code
async function fetchAirlineDetails(carrierCodes) {
  try {
    const response = await amadeus.referenceData.airlines.get({
      airlineCodes: carrierCodes.join(","),
    });
    const airlineData = response.data.reduce((acc, airline) => {
      acc[airline.iataCode] =
        airline.businessName || airline.commonName || airline.iataCode;
      return acc;
    }, {});
    return airlineData;
  } catch (error) {
    console.error(
      "Error fetching airline details:",
      error.response?.data || error.message
    );
    return {};
  }
}

// Helper function to ensure the countries table exists and is populated
async function ensureCountriesTable() {
  try {
    // Check if the countries table exists
    const tableCheck = await pool.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'countries')"
    );
    const tableExists = tableCheck.rows[0].exists;

    if (!tableExists) {
      console.log("Creating and populating countries table...");
      // Start a transaction
      await pool.query("BEGIN");

      // Create the table
      await pool.query(`
        CREATE TABLE countries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          code CHAR(2) NOT NULL UNIQUE,
          flag VARCHAR(10) NOT NULL,
          currency_name VARCHAR(100) NOT NULL,
          currency_code CHAR(3) NOT NULL,
          currency_symbol VARCHAR(10) NOT NULL
        )
      `);

      // Populate with 195 countries
      await pool.query(`
        INSERT INTO countries (name, code, flag, currency_name, currency_code, currency_symbol) VALUES
        ('Afghanistan', 'AF', '🇦🇫', 'Afghan Afghani', 'AFN', '؋'),
        ('Albania', 'AL', '🇦🇱', 'Albanian Lek', 'ALL', 'L'),
        ('Algeria', 'DZ', '🇩🇿', 'Algerian Dinar', 'DZD', 'د.ج'),
        ('Andorra', 'AD', '🇦🇩', 'Euro', 'EUR', '€'),
        ('Angola', 'AO', '🇦🇴', 'Angolan Kwanza', 'AOA', 'Kz'),
        ('Antigua and Barbuda', 'AG', '🇦🇬', 'East Caribbean Dollar', 'XCD', '$'),
        ('Argentina', 'AR', '🇦🇷', 'Argentine Peso', 'ARS', '$'),
        ('Armenia', 'AM', '🇦🇲', 'Armenian Dram', 'AMD', '֏'),
        ('Australia', 'AU', '🇦🇺', 'Australian Dollar', 'AUD', '$'),
        ('Austria', 'AT', '🇦🇹', 'Euro', 'EUR', '€'),
        ('Azerbaijan', 'AZ', '🇦🇿', 'Azerbaijani Manat', 'AZN', '₼'),
        ('Bahamas', 'BS', '🇧🇸', 'Bahamian Dollar', 'BSD', '$'),
        ('Bahrain', 'BH', '🇧🇭', 'Bahraini Dinar', 'BHD', '.د.ب'),
        ('Bangladesh', 'BD', '🇧🇩', 'Bangladeshi Taka', 'BDT', '৳'),
        ('Barbados', 'BB', '🇧🇧', 'Barbadian Dollar', 'BBD', '$'),
        ('Belarus', 'BY', '🇧🇾', 'Belarusian Rubles', 'BYN', 'Br'),
        ('Belgium', 'BE', '🇧🇪', 'Euro', 'EUR', '€'),
        ('Belize', 'BZ', '🇧🇿', 'Belize Dollar', 'BZD', '$'),
        ('Benin', 'BJ', '🇧🇯', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Bhutan', 'BT', '🇧🇹', 'Bhutanese Ngultrum', 'BTN', 'Nu.'),
        ('Bolivia', 'BO', '🇧🇴', 'Bolivian Boliviano', 'BOB', 'Bs.'),
        ('Bosnia and Herzegovina', 'BA', '🇧🇦', 'Bosnia-Herzegovina Convertible Mark', 'BAM', 'KM'),
        ('Botswana', 'BW', '🇧🇼', 'Botswana Pula', 'BWP', 'P'),
        ('Brazil', 'BR', '🇧🇷', 'Brazilian Real', 'BRL', 'R$'),
        ('Brunei Darussalam', 'BN', '🇧🇳', 'Brunei Dollar', 'BND', '$'),
        ('Bulgaria', 'BG', '🇧🇬', 'Bulgarian Lev', 'BGN', 'лв'),
        ('Burkina Faso', 'BF', '🇧🇫', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Burundi', 'BI', '🇧🇮', 'Burundian Franc', 'BIF', 'FBu'),
        ('Cabo Verde', 'CV', '🇨🇻', 'Cape Verdean Escudo', 'CVE', '$'),
        ('Cambodia', 'KH', '🇰🇭', 'Cambodian Riel', 'KHR', '៛'),
        ('Cameroon', 'CM', '🇨🇲', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Canada', 'CA', '🇨🇦', 'Canadian Dollar', 'CAD', '$'),
        ('Central African Republic', 'CF', '🇨🇫', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Chad', 'TD', '🇹🇩', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Chile', 'CL', '🇨🇱', 'Chilean Peso', 'CLP', '$'),
        ('China', 'CN', '🇨🇳', 'Chinese Yuan', 'CNY', '¥'),
        ('Colombia', 'CO', '🇨🇴', 'Colombian Peso', 'COP', '$'),
        ('Comoros', 'KM', '🇰🇲', 'Comorian Franc', 'KMF', 'CF'),
        ('Congo', 'CG', '🇨🇬', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Congo, Democratic Republic of the', 'CD', '🇨🇩', 'Congolese Franc', 'CDF', 'FC'),
        ('Costa Rica', 'CR', '🇨🇷', 'Costa Rican Colón', 'CRC', '₡'),
        ('Côte d''Ivoire', 'CI', '🇨🇮', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Croatia', 'HR', '🇭🇷', 'Euro', 'EUR', '€'),
        ('Cuba', 'CU', '🇨🇺', 'Cuban Peso', 'CUP', '$'),
        ('Cyprus', 'CY', '🇨🇾', 'Euro', 'EUR', '€'),
        ('Czechia', 'CZ', '🇨🇿', 'Czech Koruna', 'CZK', 'Kč'),
        ('Denmark', 'DK', '🇩🇰', 'Danish Krone', 'DKK', 'kr'),
        ('Djibouti', 'DJ', '🇩🇯', 'Djiboutian Franc', 'DJF', 'Fdj'),
        ('Dominica', 'DM', '🇩🇲', 'East Caribbean Dollar', 'XCD', '$'),
        ('Dominican Republic', 'DO', '🇩🇴', 'Dominican Peso', 'DOP', '$'),
        ('Ecuador', 'EC', '🇪🇨', 'United States Dollar', 'USD', '$'),
        ('Egypt', 'EG', '🇪🇬', 'Egyptian Pound', 'EGP', '£'),
        ('El Salvador', 'SV', '🇸🇻', 'United States Dollar', 'USD', '$'),
        ('Equatorial Guinea', 'GQ', '🇬🇶', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Eritrea', 'ER', '🇪🇷', 'Eritrean Nakfa', 'ERN', 'Nfk'),
        ('Estonia', 'EE', '🇪🇪', 'Euro', 'EUR', '€'),
        ('Eswatini', 'SZ', '🇸🇿', 'Swazi Lilangeni', 'SZL', 'E'),
        ('Ethiopia', 'ET', '🇪🇹', 'Ethiopian Birr', 'ETB', 'Br'),
        ('Fiji', 'FJ', '🇫🇯', 'Fijian Dollar', 'FJD', '$'),
        ('Finland', 'FI', '🇫🇮', 'Euro', 'EUR', '€'),
        ('France', 'FR', '🇫🇷', 'Euro', 'EUR', '€'),
        ('Gabon', 'GA', '🇬🇦', 'Central African CFA Franc', 'XAF', 'CFA'),
        ('Gambia', 'GM', '🇬🇲', 'Gambian Dalasi', 'GMD', 'D'),
        ('Georgia', 'GE', '🇬🇪', 'Georgian Lari', 'GEL', '₾'),
        ('Germany', 'DE', '🇩🇪', 'Euro', 'EUR', '€'),
        ('Ghana', 'GH', '🇬🇭', 'Ghanaian Cedi', 'GHS', '₵'),
        ('Greece', 'GR', '🇬🇷', 'Euro', 'EUR', '€'),
        ('Grenada', 'GD', '🇬🇩', 'East Caribbean Dollar', 'XCD', '$'),
        ('Guatemala', 'GT', '🇬🇹', 'Guatemalan Quetzal', 'GTQ', 'Q'),
        ('Guinea', 'GN', '🇬🇳', 'Guinean Franc', 'GNF', 'FG'),
        ('Guinea-Bissau', 'GW', '🇬🇼', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Guyana', 'GY', '🇬🇾', 'Guyanese Dollar', 'GYD', '$'),
        ('Haiti', 'HT', '🇭🇹', 'Haitian Gourde', 'HTG', 'G'),
        ('Honduras', 'HN', '🇭🇳', 'Honduran Lempira', 'HNL', 'L'),
        ('Hungary', 'HU', '🇭🇺', 'Hungarian Forint', 'HUF', 'Ft'),
        ('Iceland', 'IS', '🇮🇸', 'Icelandic Króna', 'ISK', 'kr'),
        ('India', 'IN', '🇮🇳', 'Indian Rupee', 'INR', '₹'),
        ('Indonesia', 'ID', '🇮🇩', 'Indonesian Rupiah', 'IDR', 'Rp'),
        ('Iran', 'IR', '🇮🇷', 'Iranian Rial', 'IRR', '﷼'),
        ('Iraq', 'IQ', '🇮🇶', 'Iraqi Dinar', 'IQD', 'ع.د'),
        ('Ireland', 'IE', '🇮🇪', 'Euro', 'EUR', '€'),
        ('Israel', 'IL', '🇮🇱', 'Israeli New Shekel', 'ILS', '₪'),
        ('Italy', 'IT', '🇮🇹', 'Euro', 'EUR', '€'),
        ('Jamaica', 'JM', '🇯🇲', 'Jamaican Dollar', 'JMD', '$'),
        ('Japan', 'JP', '🇯🇵', 'Japanese Yen', 'JPY', '¥'),
        ('Jordan', 'JO', '🇯🇴', 'Jordanian Dinar', 'JOD', 'د.ا'),
        ('Kazakhstan', 'KZ', '🇰🇿', 'Kazakhstani Tenge', 'KZT', '₸'),
        ('Kenya', 'KE', '🇰🇪', 'Kenyan Shilling', 'KES', 'KSh'),
        ('Kiribati', 'KI', '🇰🇮', 'Australian Dollar', 'AUD', '$'),
        ('Korea, Democratic People''s Republic of', 'KP', '🇰🇵', 'North Korean Won', 'KPW', '₩'),
        ('Korea, Republic of', 'KR', '🇰🇷', 'South Korean Won', 'KRW', '₩'),
        ('Kuwait', 'KW', '🇰🇼', 'Kuwaiti Dinar', 'KWD', 'د.ك'),
        ('Kyrgyzstan', 'KG', '🇰🇬', 'Kyrgyzstani Som', 'KGS', 'с'),
        ('Lao People''s Democratic Republic', 'LA', '🇱🇦', 'Lao Kip', 'LAK', '₭'),
        ('Latvia', 'LV', '🇻🇻', 'Euro', 'EUR', '€'),
        ('Lebanon', 'LB', '🇱🇧', 'Lebanese Pound', 'LBP', 'ل.ل'),
        ('Lesotho', 'LS', '🇱🇸', 'Lesotho Loti', 'LSL', 'L'),
        ('Liberia', 'LR', '🇱🇷', 'Liberian Dollar', 'LRD', '$'),
        ('Libya', 'LY', '🇱🇾', 'Libyan Dinar', 'LYD', 'ل.د'),
        ('Liechtenstein', 'LI', '🇱🇮', 'Swiss Franc', 'CHF', 'Fr'),
        ('Lithuania', 'LT', '🇱🇹', 'Euro', 'EUR', '€'),
        ('Luxembourg', 'LU', '🇱🇺', 'Euro', 'EUR', '€'),
        ('Madagascar', 'MG', '🇲🇬', 'Malagasy Ariary', 'MGA', 'Ar'),
        ('Malawi', 'MW', '🇲🇼', 'Malawian Kwacha', 'MWK', 'MK'),
        ('Malaysia', 'MY', '🇲🇾', 'Malaysian Ringgit', 'MYR', 'RM'),
        ('Maldives', 'MV', '🇲🇻', 'Maldivian Rufiyaa', 'MVR', '.ރ'),
        ('Mali', 'ML', '🇲🇱', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Malta', 'MT', '🇲🇹', 'Euro', 'EUR', '€'),
        ('Marshall Islands', 'MH', '🇲🇭', 'United States Dollar', 'USD', '$'),
        ('Mauritania', 'MR', '🇲🇷', 'Mauritanian Ouguiya', 'MRU', 'UM'),
        ('Mauritius', 'MU', '🇲🇺', 'Mauritian Rupee', 'MUR', '₨'),
        ('Mexico', 'MX', '🇲🇽', 'Mexican Peso', 'MXN', '$'),
        ('Micronesia, Federated States of', 'FM', '🇫🇲', 'United States Dollar', 'USD', '$'),
        ('Moldova', 'MD', '🇲🇩', 'Moldovan Leu', 'MDL', 'L'),
        ('Monaco', 'MC', '🇲🇨', 'Euro', 'EUR', '€'),
        ('Mongolia', 'MN', '🇲🇳', 'Mongolian Tögrög', 'MNT', '₮'),
        ('Montenegro', 'ME', '🇲🇪', 'Euro', 'EUR', '€'),
        ('Morocco', 'MA', '🇲🇦', 'Moroccan Dirham', 'MAD', 'د.م.'),
        ('Mozambique', 'MZ', '🇲🇿', 'Mozambican Metical', 'MZN', 'MT'),
        ('Myanmar', 'MM', '🇲🇲', 'Myanmar Kyat', 'MMK', 'K'),
        ('Namibia', 'NA', '🇳🇦', 'Namibian Dollar', 'NAD', '$'),
        ('Nauru', 'NR', '🇳🇷', 'Australian Dollar', 'AUD', '$'),
        ('Nepal', 'NP', '🇳🇵', 'Nepalese Rupee', 'NPR', '₨'),
        ('Netherlands', 'NL', '🇳🇱', 'Euro', 'EUR', '€'),
        ('New Zealand', 'NZ', '🇳🇿', 'New Zealand Dollar', 'NZD', '$'),
        ('Nicaragua', 'NI', '🇳🇮', 'Nicaraguan Córdoba', 'NIO', 'C$'),
        ('Niger', 'NE', '🇳🇪', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Nigeria', 'NG', '🇳🇬', 'Nigerian Naira', 'NGN', '₦'),
        ('North Macedonia', 'MK', '🇲🇰', 'Macedonian Denar', 'MKD', 'ден'),
        ('Norway', 'NO', '🇳🇴', 'Norwegian Krone', 'NOK', 'kr'),
        ('Oman', 'OM', '🇴🇲', 'Omani Rial', 'OMR', 'ر.ع.'),
        ('Pakistan', 'PK', '🇵🇰', 'Pakistani Rupee', 'PKR', '₨'),
        ('Palau', 'PW', '🇵🇼', 'United States Dollar', 'USD', '$'),
        ('Palestine', 'PS', '🇵🇸', 'Israeli New Shekel', 'ILS', '₪'),
        ('Panama', 'PA', '🇵🇦', 'Panamanian Balboa', 'PAB', 'B/.'),
        ('Papua New Guinea', 'PG', '🇵🇬', 'Papua New Guinean Kina', 'PGK', 'K'),
        ('Paraguay', 'PY', '🇵🇾', 'Paraguayan Guaraní', 'PYG', '₲'),
        ('Peru', 'PE', '🇵🇪', 'Peruvian Sol', 'PEN', 'S/'),
        ('Philippines', 'PH', '🇵🇭', 'Philippine Peso', 'PHP', '₱'),
        ('Poland', 'PL', '🇵🇱', 'Polish Złoty', 'PLN', 'zł'),
        ('Portugal', 'PT', '🇵🇹', 'Euro', 'EUR', '€'),
        ('Qatar', 'QA', '🇶🇦', 'Qatari Riyal', 'QAR', 'ر.ق'),
        ('Romania', 'RO', '🇷🇴', 'Romanian Leu', 'RON', 'lei'),
        ('Russian Federation', 'RU', '🇷🇺', 'Russian Rubles', 'RUB', '₽'),
        ('Rwanda', 'RW', '🇷🇼', 'Rwandan Franc', 'RWF', 'FRw'),
        ('Saint Kitts and Nevis', 'KN', '🇰🇳', 'East Caribbean Dollar', 'XCD', '$'),
        ('Saint Lucia', 'LC', '🇱🇨', 'East Caribbean Dollar', 'XCD', '$'),
        ('Saint Vincent and the Grenadines', 'VC', '🇻🇨', 'East Caribbean Dollar', 'XCD', '$'),
        ('Samoa', 'WS', '🇼🇸', 'Samoan Tālā', 'WST', '$'),
        ('San Marino', 'SM', '🇸🇲', 'Euro', 'EUR', '€'),
        ('Sao Tome and Principe', 'ST', '🇸🇹', 'São Tomé and Príncipe Dobra', 'STN', 'Db'),
        ('Saudi Arabia', 'SA', '🇸🇦', 'Saudi Riyal', 'SAR', 'ر.س'),
        ('Senegal', 'SN', '🇸🇳', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Serbia', 'RS', '🇷🇸', 'Serbian Dinar', 'RSD', 'дин'),
        ('Seychelles', 'SC', '🇸🇨', 'Seychellois Rupee', 'SCR', '₨'),
        ('Sierra Leone', 'SL', '🇸🇱', 'Sierra Leonean Leone', 'SLE', 'Le'),
        ('Singapore', 'SG', '🇸🇬', 'Singapore Dollar', 'SGD', '$'),
        ('Slovakia', 'SK', '🇸🇰', 'Euro', 'EUR', '€'),
        ('Slovenia', 'SI', '🇸🇮', 'Euro', 'EUR', '€'),
        ('Solomon Islands', 'SB', '🇸🇧', 'Solomon Islands Dollar', 'SBD', '$'),
        ('Somalia', 'SO', '🇸🇴', 'Somali Shilling', 'SOS', 'Sh'),
        ('South Africa', 'ZA', '🇿🇦', 'South African Rand', 'ZAR', 'R'),
        ('South Sudan', 'SS', '🇸🇸', 'South Sudanese Pound', 'SSP', '£'),
        ('Spain', 'ES', '🇪🇸', 'Euro', 'EUR', '€'),
        ('Sri Lanka', 'LK', '🇬🇱', 'Sri Lankan Rupee', 'LKR', '₨'),
        ('Sudan', 'SD', '🇸🇩', 'Sudanese Pound', 'SDG', '£'),
        ('Suriname', 'SR', '🇸🇷', 'Surinamese Dollar', 'SRD', '$'),
        ('Sweden', 'SE', '🇸🇪', 'Swedish Krona', 'SEK', 'kr'),
        ('Switzerland', 'CH', '🇨🇭', 'Swiss Franc', 'CHF', 'Fr'),
        ('Syrian Arab Republic', 'SY', '🇸🇾', 'Syrian Pound', 'SYP', '£'),
        ('Tajikistan', 'TJ', '🇹🇯', 'Tajikistani Somoni', 'TJS', 'SM'),
        ('Tanzania', 'TZ', '🇹🇿', 'Tanzanian Shilling', 'TZS', 'TSh'),
        ('Thailand', 'TH', '🇹🇭', 'Thai Baht', 'THB', '฿'),
        ('Timor-Leste', 'TL', '🇹🇱', 'United States Dollar', 'USD', '$'),
        ('Togo', 'TG', '🇹🇬', 'West African CFA Franc', 'XOF', 'CFA'),
        ('Tonga', 'TO', '🇹🇴', 'Tongan Paʻanga', 'TOP', 'T$'),
        ('Trinidad and Tobago', 'TT', '🇹🇹', 'Trinidad and Tobago Dollar', 'TTD', '$'),
        ('Tunisia', 'TN', '🇹🇳', 'Tunisian Dinar', 'TND', 'د.ت'),
        ('Turkey', 'TR', '🇹🇷', 'Turkish Lira', 'TRY', '₺'),
        ('Turkmenistan', 'TM', '🇹🇲', 'Turkmenistan Manat', 'TMT', 'm'),
        ('Tuvalu', 'TV', '🇹🇻', 'Australian Dollar', 'AUD', '$'),
        ('Uganda', 'UG', '🇺🇬', 'Ugandan Shilling', 'UGX', 'USh'),
        ('Ukraine', 'UA', '🇺🇦', 'Ukrainian Hryvnia', 'UAH', '₴'),
        ('United Arab Emirates', 'AE', '🇦🇪', 'UAE Dirham', 'AED', 'د.إ'),
        ('United Kingdom', 'GB', '🇬🇧', 'Pound Sterling', 'GBP', '£'),
        ('United States', 'US', '🇺🇸', 'United States Dollar', 'USD', '$'),
        ('Uruguay', 'UY', '🇺🇾', 'Uruguayan Peso', 'UYU', '$'),
        ('Uzbekistan', 'UZ', '🇺🇿', 'Uzbekistani Soʻm', 'UZS', 'сўм'),
        ('Vanuatu', 'VU', '🇻🇺', 'Vanuatu Vatu', 'VUV', 'VT'),
        ('Vatican City', 'VA', '🇻🇦', 'Euro', 'EUR', '€'),
        ('Venezuela', 'VE', '🇻🇪', 'Venezuelan Bolívar', 'VES', 'Bs.'),
        ('Vietnam', 'VN', '🇻🇳', 'Vietnamese Đồng', 'VND', '₫'),
        ('Yemen', 'YE', '🇾🇪', 'Yemeni Rial', 'YER', '﷼'),
        ('Zambia', 'ZM', '🇿🇲', 'Zambian Kwacha', 'ZMW', 'ZK'),
        ('Zimbabwe', 'ZW', '🇿🇼', 'Zimbabwean Dollar', 'ZWL', '$')
      `);

      // Commit the transaction
      await pool.query("COMMIT");
      console.log("Countries table created and populated with 195 countries.");
    }
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error ensuring countries table:", error.message);
    throw new Error(`Failed to ensure countries table: ${error.message}`);
  }
}

// Helper function to fetch exchange rate from external API
async function fetchExchangeRate(sourceCurrency, targetCurrency) {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      console.warn("Exchange rate API key not set, using fallback rate.");
      // Fallback static rate for testing (e.g., USD to INR)
      if (sourceCurrency === "USD" && targetCurrency === "INR") {
        return 84.23;
      }
      throw new Error("No API key provided and no fallback rate available");
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${sourceCurrency}/${targetCurrency}`
    );
    if (response.data.result !== "success") {
      throw new Error(`API error: ${response.data['error-type']}`);
    }
    return response.data.conversion_rate;
  } catch (error) {
    console.error(
      `Error fetching exchange rate for ${sourceCurrency} to ${targetCurrency}:`,
      error.message
    );
    throw new Error(`Failed to fetch exchange rate: ${error.message}`);
  }
}

// Search Flights
const searchFlights = async (req, res) => {
  const { origin, destination, date, returnDate } = req.query;

  if (!origin || !destination || !date) {
    return res
      .status(400)
      .json({ error: "Origin, destination, and departure date are required" });
  }

  try {
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: "1",
    };
    if (returnDate) params.returnDate = returnDate;

    const response = await amadeus.shopping.flightOffersSearch.get(params);
    const flights = response.data;

    const carrierCodes = [
      ...new Set(
        flights.flatMap((flight) =>
          flight.itineraries.flatMap((itinerary) =>
            itinerary.segments.map((segment) => segment.carrierCode)
          )
        )
      ),
    ];

    const airlineDetails = await fetchAirlineDetails(carrierCodes);

    const enrichedFlights = flights.map((flight) => {
      const enrichedItineraries = flight.itineraries.map((itinerary) => {
        const enrichedSegments = itinerary.segments.map((segment) => ({
          ...segment,
          airlineName:
            airlineDetails[segment.carrierCode] || segment.carrierCode,
        }));
        return { ...itinerary, segments: enrichedSegments };
      });
      return { ...flight, itineraries: enrichedItineraries };
    });

    res.json({ status: "success", flights: enrichedFlights });
  } catch (error) {
    console.error(
      "Flight search error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to search flights",
      details: error.message,
    });
  }
};

// Price Flight
const priceFlight = async (req, res) => {
  const { flightOffer } = req.body;

  if (!flightOffer) {
    return res.status(400).json({ error: "Flight offer is required" });
  }

  try {
    const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flightOffer],
        },
      })
    );
    const pricedOffer = pricingResponse.data.flightOffers[0];
    console.log("Priced offer with ID:", pricedOffer.id);

    const carrierCode = pricedOffer.itineraries[0].segments[0].carrierCode;
    const airlineDetails = await fetchAirlineDetails([carrierCode]);
    pricedOffer.itineraries[0].segments[0].airlineName =
      airlineDetails[carrierCode] || carrierCode;

    res.json({ status: "success", pricedOffer });
  } catch (error) {
    console.error(
      "Flight pricing error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to price flight",
      details: error.response?.data || error.message,
    });
  }
};

// Seat Map
const seatMap = async (req, res) => {
  const { pricedOffer } = req.body;

  if (!pricedOffer) {
    return res.status(400).json({ error: "Priced flight offer is required" });
  }
  if (!pricedOffer.id) {
    return res.status(400).json({ error: "Priced offer must include an ID" });
  }

  try {
    console.log("Fetching seat map for priced offer ID:", pricedOffer.id);
    let seatMapResponse;

    if (
      amadeus.shopping.seatMaps &&
      typeof amadeus.shopping.seatMaps.post === "function"
    ) {
      seatMapResponse = await amadeus.shopping.seatMaps.post(
        JSON.stringify({ data: [pricedOffer] })
      );
    } else {
      console.warn("SDK seatMaps.post not available, using fallback");
      seatMapResponse = await fetchSeatMap(pricedOffer);
    }

    res.json({
      status: "success",
      seatMaps: seatMapResponse.data || seatMapResponse,
    });
  } catch (error) {
    console.error("Seat map error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to retrieve seat map",
      details: error.response?.data || error.message,
    });
  }
};

// Book Flight
const bookFlight = async (req, res) => {
  const { pricedOffer, travelers, addons, gstin } = req.body;
  const userId = req.user.id;

  if (!pricedOffer || !pricedOffer.id) {
    return res
      .status(400)
      .json({ error: "Priced flight offer with ID is required" });
  }
  if (!travelers || !Array.isArray(travelers) || travelers.length === 0) {
    return res.status(400).json({ error: "Traveler information is required" });
  }

  try {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let totalPrice = parseFloat(pricedOffer.price.total);
    const seatSelectionFee = addons?.selectedSeat ? 350 : 0;
    const baggageFee = addons?.baggage ? 1650 : 0;
    const travelInsuranceFee = addons?.travelInsurance ? 199 : 0;
    const refundableBookingFee = addons?.refundableBooking ? 490 : 0;
    const taxAndCharges = totalPrice * 0.18;

    totalPrice +=
      seatSelectionFee +
      baggageFee +
      travelInsuranceFee +
      refundableBookingFee +
      taxAndCharges;

    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: pricedOffer.price.currency || "INR",
      receipt: `booking_${userId}_${Date.now()}`,
    });

    const booking = await pool.query(
      "INSERT INTO bookings (user_id, flight_id, total_price, amadeus_order_id, payment_id, status, selected_seat, baggage, travel_insurance, refundable_booking, gstin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        userId,
        pricedOffer.id,
        totalPrice,
        "",
        paymentOrder.id,
        "pending",
        addons?.selectedSeat || null,
        addons?.baggage ? "3kg" : null,
        addons?.travelInsurance || false,
        addons?.refundableBooking || false,
        gstin || null,
      ]
    );

    res.json({
      status: "payment_required",
      paymentOrder,
      bookingId: booking.rows[0].id,
      totalPrice: totalPrice.toFixed(2),
      breakdown: {
        basePrice: parseFloat(pricedOffer.price.total),
        seatSelectionFee,
        baggageFee,
        travelInsuranceFee,
        refundableBookingFee,
        taxAndCharges,
      },
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({
      error: "Failed to create payment order",
      details: error.message,
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { paymentId, orderId, signature, pricedOffer, travelers, bookingId } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (
      !paymentId ||
      !orderId ||
      !signature ||
      !pricedOffer ||
      !travelers ||
      !bookingId
    ) {
      return res.status(400).json({
        error: "All payment, booking, and traveler details are required",
      });
    }

    // Step 1: Verify Razorpay Payment Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "failed",
        bookingId,
      ]);
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Step 2: Fetch Booking Details from DB
    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingResult.rows[0];
    const totalPrice = Number(booking.total_price) || 0; // Ensure totalPrice is a valid number

    // Step 3: Prepare Travelers Data for Amadeus API
    const formattedTravelers = travelers.map((traveler, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: traveler.dateOfBirth,
      name: traveler.name,
      gender: traveler.gender,
      contact: {
        emailAddress: traveler.email,
        phones: traveler.phones.map((phone) => ({
          deviceType: phone.deviceType || "MOBILE",
          countryCallingCode: phone.countryCallingCode,
          number: phone.number,
        })),
      },
    }));

    // Step 4: Create Booking with Amadeus API
    let amadeusOrderId = "N/A";
    let pnr = "N/A";
    try {
      console.log("Creating booking with Amadeus API...");
      const bookingResponse = await amadeus.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: "flight-order",
            flightOffers: [pricedOffer],
            travelers: formattedTravelers,
          },
        })
      );
      console.log("Amadeus booking response:", bookingResponse);

      amadeusOrderId = bookingResponse?.data?.id || "N/A";
      pnr =
        bookingResponse?.data?.associatedRecords?.[0]?.reference || "N/A";
    } catch (error) {
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "failed",
        bookingId,
      ]);
      return res.status(500).json({
        error: "Failed to create booking with Amadeus",
        details: error.response?.data?.errors || error.message,
      });
    }

    // Step 5: Update Booking Status in Database & Store Signature
    const updatedBooking = await pool.query(
      "UPDATE bookings SET amadeus_order_id = $1, pnr = $2, payment_id = $3, order_id = $4, signature = $5, status = $6, total_price = $7 WHERE id = $8 AND user_id = $9 RETURNING *",
      [
        amadeusOrderId,
        pnr,
        paymentId,
        orderId,
        signature,
        "confirmed",
        totalPrice,
        bookingId,
        userId,
      ]
    );

    if (updatedBooking.rows.length === 0) {
      throw new Error("Failed to update booking status to confirmed");
    }

    // Step 6: Return Successful Response
    res.json({
      status: "success",
      message: "Flight booked successfully",
      booking: {
        id: updatedBooking.rows[0].id,
        amadeusOrderId,
        pnr,
        selectedSeat: booking.selected_seat,
        baggage: booking.baggage,
        travelInsurance: booking.travel_insurance,
        refundableBooking: booking.refundable_booking,
        totalPrice: totalPrice.toFixed(2),
        status: "confirmed",
      },
    });
  } catch (error) {
    console.error(
      "Booking Confirmation Error:",
      error.response?.data || error.message
    );
    console.log("Error details:", error.message);
    console.log("bookingId Error stack:", bookingId);
    if (bookingId) {
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "failed",
        bookingId,
      ]);
    }

    res.status(500).json({
      error: "Failed to confirm booking",
      details: error.response?.data?.errors || error.message,
    });
  }
};

// Live Airport Search
const liveAirportSearch = async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: term,
      subType: "AIRPORT,CITY",
    });
    const suggestions = response.data.map((location) => ({
      label: `${location.name} (${location.iataCode}) - ${location.detailedName}`,
      value: location.iataCode,
    }));
    res.json(suggestions);
  } catch (error) {
    console.error(
      "Airport search error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to search airports",
      details: error.message,
    });
  }
};

// Get Bookings
const getBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await pool.query(
      "SELECT amadeus_order_id, pnr, selected_seat, baggage, travel_insurance, refundable_booking, status FROM bookings WHERE user_id = $1",
      [userId]
    );
    console.log(`Fetched ${bookings.rows.length} bookings for user ${userId}`);

    const bookingDetails = await Promise.all(
      bookings.rows.map(async (booking) => {
        try {
          const response = await amadeus.booking
            .flightOrder(booking.amadeus_order_id)
            .get();
          console.log(
            `Successfully fetched details for order ${booking.amadeus_order_id}`
          );
          return {
            ...response.data,
            pnr: booking.pnr,
            selectedSeat: booking.selected_seat,
            baggage: booking.baggage,
            travelInsurance: booking.travel_insurance,
            refundableBooking: booking.refundable_booking,
            status: booking.status,
          };
        } catch (error) {
          console.error(
            `Error fetching details for order ${booking.amadeus_order_id}:`,
            error.response?.data || error
          );
          return {
            amadeus_order_id: booking.amadeus_order_id,
            pnr: booking.pnr,
            selectedSeat: booking.selected_seat,
            baggage: booking.baggage,
            travelInsurance: booking.travel_insurance,
            refundableBooking: booking.refundable_booking,
            status: booking.status,
            error: "Failed to fetch booking details",
            details: error.message || "Unknown error",
          };
        }
      })
    );
    res.json({ status: "success", bookings: bookingDetails });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch bookings",
      details: error.message || "Unknown error",
    });
  }
};

// Get Booking By ID
const getBookingById = async (req, res) => {
  const { amadeusOrderId } = req.params;
  const encodedAmadeusOrderId = encodeURIComponent(amadeusOrderId);

  console.log("Received Booking ID:", amadeusOrderId);
  console.log("Decoded Booking ID:", decodeURIComponent(amadeusOrderId));

  try {
    const booking = await pool.query(
      "SELECT id, amadeus_order_id, pnr, selected_seat, baggage, travel_insurance, refundable_booking, status FROM bookings WHERE amadeus_order_id = $1",
      [encodedAmadeusOrderId]
    );

    if (booking.rows.length === 0) {
      console.log("No Booking Found in DB");
      return res.status(404).json({ error: "Booking not found" });
    }

    console.log("Found Booking in DB:", booking.rows[0]);

    const response = await amadeus.booking
      .flightOrder(booking.rows[0].amadeus_order_id)
      .get();

    res.json({
      status: "success",
      booking: {
        ...response.data,
        pnr: booking.rows[0].pnr,
        selectedSeat: booking.rows[0].selected_seat,
        baggage: booking.rows[0].baggage,
        travelInsurance: booking.rows[0].travel_insurance,
        refundableBooking: booking.rows[0].refundable_booking,
        status: booking.rows[0].status,
      },
    });
  } catch (error) {
    console.error("Booking fetch error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch booking", details: error.message });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  const { amadeusOrderId } = req.params;
  const userId = req.user.id;

  try {
    const booking = await pool.query(
      "SELECT amadeus_order_id FROM bookings WHERE amadeus_order_id = $1 AND user_id = $2",
      [amadeusOrderId, userId]
    );
    if (booking.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await amadeus.booking.flightOrder(booking.rows[0].amadeus_order_id).delete();
    await pool.query(
      "UPDATE bookings SET status = $1 WHERE amadeus_order_id = $2",
      ["cancelled", amadeusOrderId]
    );

    res.json({ status: "success", message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error.message);
    res.status(500).json({
      error: "Failed to cancel booking",
      details: error.message,
    });
  }
};

// Get Invoice
const getInvoice = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No user found in token." });
    }

    const { amadeusOrderId } = req.params;
    const decodedOrderId = decodeURIComponent(amadeusOrderId);
    const encodedOrderId = encodeURIComponent(decodedOrderId);
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. User ID missing." });
    }

    console.log("📌 Received Booking ID:", amadeusOrderId);
    console.log("📌 Decoded Booking ID:", decodedOrderId);
    console.log("📌 Re-encoded Booking ID for DB:", encodedOrderId);
    console.log("📌 User ID from Token:", userId);

    // Fetch Booking Data
    const bookingQuery = `
      SELECT id, amadeus_order_id, pnr, selected_seat, baggage, travel_insurance, refundable_booking, status 
      FROM bookings 
      WHERE (amadeus_order_id = $1 OR amadeus_order_id = $2) 
      AND user_id = $3
    `;
    const bookingResult = await pool.query(bookingQuery, [
      decodedOrderId,
      encodedOrderId,
      userId,
    ]);

    if (bookingResult.rows.length === 0) {
      console.log("❌ No booking found in DB for:", decodedOrderId);
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingResult.rows[0];

    if (!booking.amadeus_order_id) {
      return res
        .status(400)
        .json({ error: "Invalid or missing Amadeus order ID" });
    }

    console.log("✅ Booking Found:", booking);

    let bookingDetails;
    try {
      bookingDetails = await amadeus.booking
        .flightOrder(booking.amadeus_order_id)
        .get();

      console.log(
        "✅ Amadeus API Full Response:",
        JSON.stringify(bookingDetails, null, 2)
      );

      if (!bookingDetails?.data || typeof bookingDetails.data !== "object") {
        console.log("❌ Invalid Amadeus response:", bookingDetails);
        return res.status(500).json({
          error: "Failed to fetch valid booking details from Amadeus",
          details: "Missing or invalid booking data",
        });
      }
    } catch (apiError) {
      console.error(
        "❌ Amadeus API Error:",
        apiError.message,
        apiError.response?.data
      );
      return res.status(apiError.response?.status || 500).json({
        error: "Failed to fetch booking details from Amadeus",
        details: apiError.response?.data || apiError.message,
      });
    }

    // Fetch User Data
    const userQuery = "SELECT id, name, email, phone FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      console.log("❌ No user found in DB for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    console.log("✅ User Data:", user);
    console.log("✅ Amadeus API Response Data:", bookingDetails.data);

    // Ensure `id` field exists in Amadeus response
    const amadeusId = bookingDetails.data?.id || null;
    if (!amadeusId) {
      console.error("❌ Missing 'id' in Amadeus API response");
      return res.status(500).json({
        error: "Invalid Amadeus response",
        details: "Amadeus booking data is missing 'id'",
      });
    }

    console.log("✅ Amadeus Order ID:", amadeusId);

    // Prepare invoice data
    const invoiceData = {
      bookingId: booking.id,
      amadeusId,
      pnr: booking.pnr || "N/A",
      selectedSeat: booking.selected_seat || null,
      baggage: booking.baggage || null,
      travelInsurance: booking.travel_insurance || false,
      refundableBooking: booking.refundable_booking || false,
      status: booking.status || "unknown",
      ...bookingDetails.data, // Spread remaining Amadeus data
    };

    generateInvoice(invoiceData, user, res);
  } catch (error) {
    console.error("❌ Invoice generation error:", error.message, error.stack);
    res.status(500).json({
      error: "Failed to generate invoice",
      details: error.message,
    });
  }
};

// Fetch All Countries
const getAllCountries = async (req, res) => {
  try {
    // Ensure the countries table exists and is populated
    await ensureCountriesTable();

    const result = await pool.query("SELECT * FROM countries ORDER BY name");
    res.status(200).json({
      status: "success",
      countries: result.rows,
    });
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({
      error: "Failed to fetch countries",
      details: error.message,
    });
  }
};

// Update Currency by Country Name
const updateCountryCurrency = async (req, res) => {
  const { name } = req.params;
  const { currency_name, currency_code, currency_symbol } = req.body;

  // Validate request body
  if (!currency_name || !currency_code || !currency_symbol) {
    return res.status(400).json({
      error: "currency_name, currency_code, and currency_symbol are required",
    });
  }

  if (currency_code.length !== 3) {
    return res.status(400).json({
      error: "currency_code must be exactly 3 characters",
    });
  }

  try {
    // Ensure the countries table exists and is populated
    await ensureCountriesTable();

    // Check if country exists
    const countryCheck = await pool.query(
      "SELECT * FROM countries WHERE name = $1",
      [name]
    );
    if (countryCheck.rows.length === 0) {
      return res.status(404).json({ error: `Country '${name}' not found` });
    }

    // Update currency details
    const result = await pool.query(
      `UPDATE countries
       SET currency_name = $1, currency_code = $2, currency_symbol = $3
       WHERE name = $4
       RETURNING *`,
      [currency_name, currency_code, currency_symbol, name]
    );

    res.status(200).json({
      status: "success",
      country: result.rows[0],
    });
  } catch (error) {
    console.error(`Error updating currency for ${name}:`, error.message);
    res.status(500).json({
      error: "Failed to update currency",
      details: error.message,
    });
  }
};

// Convert Currency between Countries
const convertCurrency = async (req, res) => {
  const { sourceCountry, targetCountry, amount } = req.body;

  // Validate request body
  if (!sourceCountry || !targetCountry || amount === undefined) {
    return res.status(400).json({
      error: "sourceCountry, targetCountry, and amount are required",
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      error: "amount must be a positive number",
    });
  }

  try {
    // Ensure the countries table exists and is populated
    await ensureCountriesTable();

    // Fetch source and target country details
    const sourceCountryCheck = await pool.query(
      "SELECT name, currency_code, currency_name, currency_symbol FROM countries WHERE name = $1",
      [sourceCountry]
    );
    const targetCountryCheck = await pool.query(
      "SELECT name, currency_code, currency_name, currency_symbol FROM countries WHERE name = $1",
      [targetCountry]
    );

    if (sourceCountryCheck.rows.length === 0) {
      return res.status(404).json({ error: `Source country '${sourceCountry}' not found` });
    }
    if (targetCountryCheck.rows.length === 0) {
      return res.status(404).json({ error: `Target country '${targetCountry}' not found` });
    }

    const source = sourceCountryCheck.rows[0];
    const target = targetCountryCheck.rows[0];

    // Fetch exchange rate
    let exchangeRate;
    try {
      exchangeRate = await fetchExchangeRate(source.currency_code, target.currency_code);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch exchange rate",
        details: error.message,
      });
    }

    // Calculate converted amount
    const convertedAmount = amount * exchangeRate;

    // Return response
    res.status(200).json({
      status: "success",
      conversion: {
        source: {
          country: source.name,
          currency_code: source.currency_code,
          currency_name: source.currency_name,
          currency_symbol: source.currency_symbol,
          amount,
        },
        target: {
          country: target.name,
          currency_code: target.currency_code,
          currency_name: target.currency_name,
          currency_symbol: target.currency_symbol,
          convertedAmount: Number(convertedAmount.toFixed(2)),
        },
        exchangeRate: Number(exchangeRate.toFixed(4)),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      `Error converting currency from ${sourceCountry} to ${targetCountry}:`,
      error.message
    );
    res.status(500).json({
      error: "Failed to convert currency",
      details: error.message,
    });
  }
};

module.exports = {
  searchFlights,
  priceFlight,
  liveAirportSearch,
  seatMap,
  bookFlight,
  confirmBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getInvoice,
  getAllCountries,
  updateCountryCurrency,
  convertCurrency,
};