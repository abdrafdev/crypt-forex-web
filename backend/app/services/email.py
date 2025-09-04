"""
Email service for sending notifications and verification emails
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

async def send_email(
    to: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Send an email to a recipient
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Plain text body
        html_body: Optional HTML body
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{settings.APP_NAME} <{settings.FROM_EMAIL}>"
        msg['To'] = to
        
        # Add plain text part
        part1 = MIMEText(body, 'plain')
        msg.attach(part1)
        
        # Add HTML part if provided
        if html_body:
            part2 = MIMEText(html_body, 'html')
            msg.attach(part2)
        
        # Send email
        if settings.SMTP_HOST and settings.SMTP_USERNAME:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_PORT == 587:
                    server.starttls()
                if settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to}")
            return True
        else:
            logger.warning(f"Email service not configured. Would have sent: {subject} to {to}")
            return True  # Return True in development
            
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        return False

async def send_verification_email(email: str, token: str) -> bool:
    """
    Send a verification email to a new user
    
    Args:
        email: User's email address
        token: Verification token
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    subject = f"Welcome to {settings.APP_NAME} - Verify Your Email"
    
    verification_link = f"http://localhost:3000/verify-email?token={token}"
    
    body = f"""
Welcome to {settings.APP_NAME}!

Please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours.

If you didn't create an account with us, please ignore this email.

Best regards,
The {settings.APP_NAME} Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        .container {{
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }}
        .content {{
            background: #f7f7f7;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {settings.APP_NAME}!</h1>
        </div>
        <div class="content">
            <p>Thank you for joining our platform.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <center>
                <a href="{verification_link}" class="button">Verify Email</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{verification_link}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
                Best regards,<br>
                The {settings.APP_NAME} Team
            </p>
        </div>
    </div>
</body>
</html>
"""
    
    return await send_email(email, subject, body, html_body)

async def send_password_reset_email(email: str, token: str) -> bool:
    """
    Send a password reset email
    
    Args:
        email: User's email address
        token: Reset token
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    subject = f"{settings.APP_NAME} - Password Reset Request"
    
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    
    body = f"""
You have requested to reset your password.

Please click the link below to reset your password:

{reset_link}

This link will expire in 1 hour.

If you didn't request this, please ignore this email and your password will remain unchanged.

Best regards,
The {settings.APP_NAME} Team
"""
    
    return await send_email(email, subject, body)

async def send_deposit_confirmation_email(email: str, amount: float, currency: str, tx_id: str) -> bool:
    """
    Send a deposit confirmation email
    
    Args:
        email: User's email address
        amount: Deposit amount
        currency: Currency code
        tx_id: Transaction ID
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    subject = f"{settings.APP_NAME} - Deposit Confirmation"
    
    body = f"""
Your deposit has been confirmed!

Details:
- Amount: {amount} {currency}
- Transaction ID: {tx_id}
- Status: Completed

The funds are now available in your account.

Best regards,
The {settings.APP_NAME} Team
"""
    
    return await send_email(email, subject, body)

async def send_withdrawal_confirmation_email(email: str, amount: float, currency: str, tx_id: str) -> bool:
    """
    Send a withdrawal confirmation email
    
    Args:
        email: User's email address
        amount: Withdrawal amount
        currency: Currency code
        tx_id: Transaction ID
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    subject = f"{settings.APP_NAME} - Withdrawal Processed"
    
    body = f"""
Your withdrawal has been processed!

Details:
- Amount: {amount} {currency}
- Transaction ID: {tx_id}
- Status: Completed

The funds have been sent to your designated address/account.

Best regards,
The {settings.APP_NAME} Team
"""
    
    return await send_email(email, subject, body)
