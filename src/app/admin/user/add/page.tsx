'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { checkEmail, checkPhone, FormatString } from '@/utils';

const AddUser = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState('user');

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
                    address: address,
                    password: CryptoJS.MD5(password).toString(),
                    role: role
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
                    router.push('/admin/user');
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
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Thêm Người Dùng</h3>
                <Link href="/admin/user" passHref>
                    <Button variant="danger">Quay Lại</Button>
                </Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Tên:</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Số Điện Thoại:</label>
                            <input
                                type="text"
                                id="phone"
                                className="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Địa Chỉ:</label>
                            <input
                                type="text"
                                id="address"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Mật Khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label htmlFor="role" className="form-label">Phân Quyền:</label>
                            <select
                                id="role"
                                className="form-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">Người Dùng</option>
                                <option value="admin">Quản Trị Viên</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group d-flex justify-content-end">
                            <button className="btn btn-success" type="submit">
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddUser;