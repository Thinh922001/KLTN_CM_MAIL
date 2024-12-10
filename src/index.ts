import express, { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON request
app.use(express.json());

app.post(
    "/send-email",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const apiKey = req.header("x-api-key");

        // Kiểm tra API Key
        if (apiKey !== process.env.API_KEY) {
            res.status(403).json({
                message: "API Key không hợp lệ!",
            });
            return;
        }

        const { to, subject, text } = req.body;

        // Cấu hình transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_EMAIL_PASSWORD,
            },
        });

        try {
            // Gửi email
            const info = await transporter.sendMail({
                from: `"Khóa Luận Tốt Nghiệp" <Lecuongthinh2001@gmail.com>`,
                to,
                subject,
                html: text,
            });

            res.status(200).json({
                message: "Email đã được gửi thành công!",
                info,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Middleware xử lý lỗi
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: "Có lỗi xảy ra trong server",
        error: err.message,
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
