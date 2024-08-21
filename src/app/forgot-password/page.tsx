'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { checkEmail, FormatString } from '@/utils';

const ForgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [token, setToken] = useState<string>('');

    const handleSendEmail = async () => {
        const formattedEmail = FormatString(email);

        if (!formattedEmail) {
            toast.warning("Không được để trống");
            return;
        }

        if (!checkEmail(formattedEmail)) {
            toast.warning("Email không đúng định dạng");
            return;
        }

        try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_API}find?email=${email}`);

            if (!userResponse.ok) {
                const userData = await userResponse.json();
                toast.error(userData.message || 'Lỗi khi tìm kiếm người dùng.');
                return;
            }

            const mailResponse = await fetch(`${process.env.NEXT_PUBLIC_MAIL_API}sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formattedEmail })
            });

            if (!mailResponse.ok) {
                const mailData = await mailResponse.json();
                toast.error(mailData.message || 'Lỗi khi gửi email.');
                return;
            }

            toast.success('Gửi mã thành công! Vui lòng kiểm tra email');

        } catch (error) {
            console.error('Network error:', error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_API}verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    resetToken: token
                })
            });

            if (!verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                toast.error(verifyData.message || 'Mã không hợp lệ vui lòng thử lại!');
                return;
            }

            const { userId } = await verifyResponse.json();

            if (!userId) {
                toast.error('Mã không hợp lệ vui lòng thử lại!');
                return;
            }

            router.push(`/reset-password/${userId}`);

        } catch (error) {
            console.error('Network error:', error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
    };

    return (
        <>
            <div className='forget-password'>
                <form className='form-signup w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Quên mật khẩu</h1>
                    <div className="row align-items-center">
                        <div className="col-sm-8">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <label htmlFor="Email">Email</label>
                            </div>
                        </div>
                        <div className="col-sm-4 send-email-button">
                            <div className="btn btn-outline-dark w-100" onClick={handleSendEmail}>
                                Gửi Email
                            </div>
                        </div>
                    </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                        <label htmlFor="Token">Mã xác nhận</label>
                    </div>
                    <button className="btn btn-dark w-100 py-2" type="submit">Xác nhận</button>
                </form>
            </div>
        </>
    );
};

export default ForgetPassword;