'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import { checkEmail, checkPhone, FormatString } from '@/utils';

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !phone || !password) {
            toast.error("Không được để trống");
            return;
        }
        if (!checkEmail(email)) {
            toast.error("Email không đúng định dạng");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}find?email=${email}`);
            const data = await response.json();

            if (response.ok) {
                if (data.user) {
                    toast.error('Email đã được đăng ký!');
                    return;
                }
            } else if (response.status === 404) {

                if (!checkPhone(phone)) {
                    toast.error('Số điện thoại không hợp lệ');
                    return
                }

                const newUser = {
                    name: name,
                    phone: phone,
                    email: email,
                    address: " ",
                    password: CryptoJS.MD5(password).toString(),
                    role: "user"
                };

                const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_API}register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (registerResponse.ok) {
                    toast.success('Đăng ký thành công');
                    setTimeout(() => {
                        router.push('/login');
                    }, 1000);
                } else {
                    const errorData = await registerResponse.json();
                    toast.error(errorData.message || 'Đã xảy ra lỗi khi đăng ký.');
                }
                return;
            } else {
                toast.error(data.message || 'Đã xảy ra lỗi khi kiểm tra email.');
                return;
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi kết nối.');
            console.error(error);
        }
    };

    return (
        <>
            <div className='register'>
                <form className='form-signup w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Đăng Ký</h1>
                    <div className="form-floating">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="Name" required />
                        <label htmlFor="Name">Họ Và Tên</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="Phone" required />
                        <label htmlFor="Phone">Số Điện Thoại</label>
                    </div>
                    <div className="form-floating">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="Email" required />
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="Password" required />
                        <label htmlFor="Password">Mật Khẩu</label>
                    </div>
                    <button className="btn btn-dark w-100 py-2" type="submit">Đăng Ký</button>
                    <span>Đã có tài khoản? <a href="/login">Đăng nhập</a></span>
                </form>
            </div>
        </>
    );
}

export default Register;
