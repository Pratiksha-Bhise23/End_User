const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendOTP = async (to, otp, type = 'email', email = null) => {
  if (type === 'sms') {
    console.log(`SMS OTP ${otp} sent to ${to}`); // Simulate SMS
    if (email) {
      // Also send to email if provided
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `<div style="font-family: Arial, sans-serif; text-align: center; background-color: #6B33C6; padding: 40px;">
        <div style="max-width: 400px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
        
          <!-- Logo -->
          <img src="https://www.multiflytravel.com/public/assets/images/logo.png" alt="Company Logo" style="width: 100px; margin-bottom: 10px;">
          
          <!-- Heading -->
          <h2 style="color: #6B33C6; font-weight: bold; margin-bottom: 10px;">MULTIFLY TRAVEL</h2>
          <img src="https://img.icons8.com/clouds/100/000000/new-post.png" alt="Email Icon" style="width: 80px; margin-bottom: 20px;">
          <h3>Here is your One Time OTP</h3>
          <p style="color: #888; font-size: 14px;">to validate your email address</p>
          
          <!-- OTP Code -->
          <h1 style="font-size: 36px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</h1>
          
          <p style="color: #E74C3C; font-size: 14px;">Valid for 5 minutes only</p>
          <hr style="margin: 20px 0;">
          
          <!-- Footer Links -->
          <p style="font-size: 12px; color: #666;">
            <a href="#" style="color: #6B33C6; text-decoration: none;">FAQs</a> |
            <a href="#" style="color: #6B33C6; text-decoration: none;">Terms & Conditions</a> |
            <a href="#" style="color: #6B33C6; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email OTP ${otp} sent to ${email}`);
    }
    return;
  }

  // Email-only case (for registration)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    html: `<div style="font-family: Arial, sans-serif; text-align: center; background-color: #6B33C6; padding: 40px;">
        <div style="max-width: 400px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
        
          <!-- Logo -->
          <img src="https://www.multiflytravel.com/public/assets/images/logo.png" alt="Company Logo" style="width: 100px; margin-bottom: 10px;">
          
          <!-- Heading -->
          <h2 style="color: #6B33C6; font-weight: bold; margin-bottom: 10px;">MULTIFLY TRAVEL</h2>
          <img src="https://img.icons8.com/clouds/100/000000/new-post.png" alt="Email Icon" style="width: 80px; margin-bottom: 20px;">
          <h3>Here is your One Time OTP</h3>
          <p style="color: #888; font-size: 14px;">to validate your email address</p>
          
          <!-- OTP Code -->
          <h1 style="font-size: 36px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</h1>
          
          <p style="color: #E74C3C; font-size: 14px;">Valid for 5 minutes only</p>
          <hr style="margin: 20px 0;">
          
          <!-- Footer Links -->
          <p style="font-size: 12px; color: #666;">
            <a href="#" style="color: #6B33C6; text-decoration: none;">FAQs</a> |
            <a href="#" style="color: #6B33C6; text-decoration: none;">Terms & Conditions</a> |
            <a href="#" style="color: #6B33C6; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email OTP ${otp} sent to ${to}`);
};

module.exports = { generateOTP, sendOTP };


