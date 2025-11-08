const verifyEmailTemplate = ({ name, url }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    background: #ffffff;
                    margin: 40px auto;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333;
                }
                p {
                    color: #555;
                    font-size: 16px;
                }
                .btn {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    padding: 14px 24px;
                    font-size: 16px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    transition: background 0.3s;
                }
                .btn:hover {
                    background-color: #45a049;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome, ${name}!</h2>
                <p>Thank you for signing up. Please verify your email to activate your account.</p>
                <p>If you did not create an account, you can ignore this email.</p>
                <a href="${url}" class="btn">Verify Email</a>
                <p class="footer">If the button doesn't work, copy and paste this link into your browser:</p>
                <p class="footer">${url}</p>
            </div>
        </body>
        </html>
    `;
};

export default verifyEmailTemplate;
