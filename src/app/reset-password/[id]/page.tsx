'use client'

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import CryptoJS from 'crypto-js';
import Form from 'react-bootstrap/Form';

const ResetPassword = () => {
    const { id } = useParams();
    const router = useRouter();
    const [updatePassword, setUpdatePassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const updateUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!updatePassword || !confirmPassword) {
            toast.error("Không được để trống");
            return;
        }
        if (confirmPassword !== updatePassword) {
            toast.error("Xác nhận mật khẩu không chính xác");
            return;
        }

        try {
            const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}create-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id })
            });

            if (!tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                toast.error(tokenData.message || 'Lỗi khi tạo token.');
                return;
            }

            const { token } = await tokenResponse.json();

            console.log(token)

            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_API}update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    password: CryptoJS.MD5(updatePassword).toString(),
                    resetToken: ''
                })
            });

            if (!updateResponse.ok) {
                const updateData = await updateResponse.json();
                toast.error(updateData.message || 'Lỗi khi cập nhật mật khẩu.');
                return;
            }

            toast.success('Đổi Mật Khẩu Thành Công');
            setUpdatePassword('');
            setConfirmPassword('');

            setTimeout(() => {
                router.push('/login');
            }, 1000);

        } catch (error) {
            toast.error('Đã xảy ra lỗi mạng. Vui lòng kiểm tra kết nối của bạn.');
            console.error('Network error:', error);
        }
    };

    return (
        <>
            <div className='forget-password'>
                <form className='form-signup w-100 m-auto' onSubmit={updateUserPassword}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhập mật khẩu mới:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={updatePassword}
                                onChange={(e) => setUpdatePassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <button className="btn btn-dark w-100 py-2" type="submit">Xác nhận</button>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;
