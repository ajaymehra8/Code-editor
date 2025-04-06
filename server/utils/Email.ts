import nodemailer, { Transporter } from "nodemailer";
import { convert } from "html-to-text";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

interface User {
  email: string;
  name?: string;
}

class Email {
  private to: string;
  private firstName?: string;
  private from: string;

  constructor(user: User) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(" ")[0] : undefined;
    this.from = process.env.EMAIL_USERNAME as string;

    if (!this.from) {
      throw new Error("EMAIL_USERNAME environment variable is not set.");
    }
  }

  private newTransport(): Transporter {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME as string,
        pass: process.env.EMAIL_PASSWORD as string,
      },
      debug: true,
    });
  }

  public async send(subject: string, message: string, email: string = this.to): Promise<void> {
    const mailOptions = {
      from: this.from,
      to: email,
      subject,
      html: message,
      text: convert(message, { wordwrap: 130 }),
    };

    try {
      console.log("Message in process...");
      await this.newTransport().sendMail(mailOptions);
      console.log("Email sent successfully.");
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }

  public async sendOtp(otp: string): Promise<void> {
    const message = `<h4>Hi ${this.firstName}, Your OTP for email verification is <b>${otp}</b></h4>`;
    await this.send("Your OTP for email verification (Valid for 5 minutes)", message);
  }
}

export default Email;
