const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const app = express();
const dotenv = require("dotenv")
const cors = require('cors');


dotenv.config();

const corsOptions = {
    origin: process.env.ORIGIN, 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};



app.use(cors(corsOptions)); // Only use this
app.use(express.json()); // To handle JSON payloads
app.use(express.urlencoded({ extended: true }));

// Middleware to handle incoming form data 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle form submission and email sending
app.post('/upload', upload.single('resume'), (req, res) => {
    console.log("inside the upload")
    const { name, email, contact } = req.body;
    const resumePath = req.file.path; // The path to the uploaded file

    // Create the transporter for sending email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "harshrajchandel.ntf@gmail.com",
            pass: "xypa yxbm ckam hhdu"
        }
    });

    // Email options
    const mailOptions = {
        from: 'harshrajchandel.ntf@gmail.com',
        to: 'harshdev.connect@gmail.com', 
        subject: 'New Contact Form Submission',
        text: `
            Name: ${name}
            Email: ${email}
            Contact Number: ${contact}
        `,
        attachments: [
            {
                filename: req.file.originalname, // File name in the email
                path: resumePath // Path to the uploaded file
            }
        ]
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send('Error sending email: ' + error);
        }
        // Delete the uploaded file after sending the email (optional)
        fs.unlinkSync(resumePath);

        res.json({ message: 'File uploaded successfully' });
    });

    res.json({ message: 'File uploaded successfully' });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
