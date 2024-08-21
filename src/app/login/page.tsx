'use client'

import { useState, FormEvent } from 'react';
import CryptoJS from 'crypto-js';
import { FormatString, checkEmail } from '@/utils';
import { toast } from "react-toastify";
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formattedEmail = FormatString(email);

        if (!formattedEmail || !password) {
            toast.warning('Không được để trống');
            return;
        }

        if (!checkEmail(formattedEmail)) {
            toast.warning('Email không đúng định dạng');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formattedEmail,
                    password: CryptoJS.MD5(password).toString()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
                toast.warning(message);
                return;
            }

            const { token, user } = data;

            if (!user) {
                toast.warning('Email hoặc Mật khẩu không chính xác');
                return;
            }

            document.cookie = `token=${token}; path=/`;
            document.cookie = `role=${user.role}; path=/`;

            localStorage.setItem('token', token);
            localStorage.setItem('id', user._id);

            if (user.role === 'admin') {
                localStorage.setItem('role', 'admin');
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi mạng. Vui lòng kiểm tra kết nối của bạn.');
            console.error('Network error:', error);
        }
    };

    return (
        <>
            <div className='login'>
                <form className='form-signin w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Đăng Nhập</h1>
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="Email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="Password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="Password">Mật Khẩu</label>
                    </div>
                    <button className="btn btn-dark w-100 py-2" type="submit">Đăng Nhập</button>
                    <div className="d-block mt-3">
                        <span>Chưa có tài khoản? <Link href="/register">Đăng Ký</Link></span>
                    </div>
                    <div className="d-block mt-2">
                        <span><Link href="/forgot-password">Quên mật khẩu</Link></span>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
