// const pool = require('../config/db');

// const createTraveler = async (req, res) => {
//   const { first_name, last_name, prefix } = req.body;
//   const userId = req.user.id;

//   if (!first_name || !last_name) {
//     return res.status(400).json({ error: 'First name and last name are required' });
//   }

//   try {
//     console.log(`Creating traveler for user ${userId} with name ${first_name} ${last_name}`); // Add logging
//     const countResult = await pool.query(
//       'SELECT COUNT(*) FROM travelers WHERE user_id = $1',
//       [userId]
//     );
//     const travelerCount = parseInt(countResult.rows[0].count, 10);

//     if (travelerCount >= 5) {
//       return res.status(400).json({ error: 'Maximum limit of 5 travelers reached' });
//     }

//     const traveler = await pool.query(
//       `INSERT INTO travelers (user_id, first_name, last_name, prefix) 
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [userId, first_name, last_name, prefix || null]
//     );

//     console.log(`Traveler created:`, traveler.rows[0]); // Add logging
//     res.json({ status: 'success', message: 'Traveler created successfully', traveler: traveler.rows[0] });
//   } catch (error) {
//     console.error('Create traveler error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const getTravelers = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     console.log(`Fetching travelers for user ${userId}`); // Add logging
//     const travelers = await pool.query('SELECT * FROM travelers WHERE user_id = $1', [userId]);
//     console.log(`Found ${travelers.rows.length} travelers`); // Add logging
//     res.json({ status: 'success', travelers: travelers.rows });
//   } catch (error) {
//     console.error('Get travelers error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const getTraveler = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user.id;
//   try {
//     console.log(`Attempting to get traveler with id ${id} for user ${userId}`); // Add logging
//     const travelerResult = await pool.query(
//       'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
//       [id, userId]
//     );
//     if (travelerResult.rows.length === 0) {
//       console.log(`Traveler ${id} not found for user ${userId}`); // Add logging
//       return res.status(404).json({ error: 'Traveler not found' });
//     }
//     console.log(`Found traveler:`, travelerResult.rows[0]); // Add logging
//     res.json({ status: 'success', traveler: travelerResult.rows[0] });
//   } catch (error) {
//     console.error('Get traveler error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const updateTraveler = async (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, prefix } = req.body;
//   const userId = req.user.id;

//   try {
//     console.log(`Updating traveler ${id} for user ${userId}`); // Add logging
//     const travelerResult = await pool.query(
//       'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
//       [id, userId]
//     );
//     if (travelerResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Traveler not found' });
//     }

//     const updatedTraveler = await pool.query(
//       `UPDATE travelers 
//        SET first_name = $1, last_name = $2, prefix = $3, updated_at = NOW() 
//        WHERE id = $4 AND user_id = $5 RETURNING *`,
//       [
//         first_name || travelerResult.rows[0].first_name,
//         last_name || travelerResult.rows[0].last_name,
//         prefix || travelerResult.rows[0].prefix,
//         id,
//         userId,
//       ]
//     );

//     console.log(`Traveler updated:`, updatedTraveler.rows[0]); // Add logging
//     res.json({ status: 'success', message: 'Traveler updated successfully', traveler: updatedTraveler.rows[0] });
//   } catch (error) {
//     console.error('Update traveler error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const deleteTraveler = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   try {
//     console.log(`Deleting traveler ${id} for user ${userId}`); // Add logging
//     const travelerResult = await pool.query(
//       'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
//       [id, userId]
//     );
//     if (travelerResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Traveler not found' });
//     }

//     await pool.query('DELETE FROM travelers WHERE id = $1 AND user_id = $2', [id, userId]);
//     console.log(`Traveler ${id} deleted`); // Add logging
//     res.json({ status: 'success', message: 'Traveler deleted successfully' });
//   } catch (error) {
//     console.error('Delete traveler error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = { createTraveler, getTravelers, updateTraveler, deleteTraveler, getTraveler };


const pool = require('../config/db');

const createTraveler = async (req, res) => {
  const { first_name, last_name, prefix } = req.body;
  const userId = req.user.id;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    console.log(`Creating traveler for user ${userId} with name ${first_name} ${last_name}`); // Add logging
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM travelers WHERE user_id = $1',
      [userId]
    );
    const travelerCount = parseInt(countResult.rows[0].count, 10);

    if (travelerCount >= 5) {
      return res.status(400).json({ error: 'Maximum limit of 5 travelers reached' });
    }

    const traveler = await pool.query(
      `INSERT INTO travelers (user_id, first_name, last_name, prefix) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, first_name, last_name, prefix || null]
    );

    console.log(`Traveler created:`, traveler.rows[0]); // Add logging
    res.json({ status: 'success', message: 'Traveler created successfully', traveler: traveler.rows[0] });
  } catch (error) {
    console.error('Create traveler error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTravelers = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log(`Fetching travelers for user ${userId}`); // Add logging
    const travelers = await pool.query('SELECT * FROM travelers WHERE user_id = $1', [userId]);
    console.log(`Found ${travelers.rows.length} travelers`); // Add logging
    res.json({ status: 'success', travelers: travelers.rows });
  } catch (error) {
    console.error('Get travelers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTraveler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    console.log(`Attempting to get traveler with id ${id} for user ${userId}`); // Add logging
    const travelerResult = await pool.query(
      'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (travelerResult.rows.length === 0) {
      console.log(`Traveler ${id} not found for user ${userId}`); // Add logging
      return res.status(404).json({ error: 'Traveler not found' });
    }
    console.log(`Found traveler:`, travelerResult.rows[0]); // Add logging
    res.json({ status: 'success', traveler: travelerResult.rows[0] });
  } catch (error) {
    console.error('Get traveler error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTraveler = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, prefix } = req.body;
  const userId = req.user.id;

  try {
    console.log(`Updating traveler ${id} for user ${userId}`); // Add logging
    const travelerResult = await pool.query(
      'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (travelerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Traveler not found' });
    }

    const updatedTraveler = await pool.query(
      `UPDATE travelers 
       SET first_name = $1, last_name = $2, prefix = $3, updated_at = NOW() 
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [
        first_name || travelerResult.rows[0].first_name,
        last_name || travelerResult.rows[0].last_name,
        prefix || travelerResult.rows[0].prefix,
        id,
        userId,
      ]
    );

    console.log(`Traveler updated:`, updatedTraveler.rows[0]); // Add logging
    res.json({ status: 'success', message: 'Traveler updated successfully', traveler: updatedTraveler.rows[0] });
  } catch (error) {
    console.error('Update traveler error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTraveler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    console.log(`Deleting traveler ${id} for user ${userId}`); // Add logging
    const travelerResult = await pool.query(
      'SELECT * FROM travelers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (travelerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Traveler not found' });
    }

    await pool.query('DELETE FROM travelers WHERE id = $1 AND user_id = $2', [id, userId]);
    console.log(`Traveler ${id} deleted`); // Add logging
    res.json({ status: 'success', message: 'Traveler deleted successfully' });
  } catch (error) {
    console.error('Delete traveler error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createTraveler, getTravelers, updateTraveler, deleteTraveler, getTraveler };