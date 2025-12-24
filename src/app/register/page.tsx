'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRegistration } from '@/hooks/useUserRegistration';

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { registerUser } = useUserRegistration({
        onSuccess: () => {
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await registerUser({
            name,
            phone,
            email,
            address: " ",
            password,
            role: "user"
        });
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
