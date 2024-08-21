'use client'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/redux/slice';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FormatNumber } from '@/utils';
import { RootState } from '@/redux/store';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') || ''
    }
}).then(res => res.json());

const Payment = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const cartItems = useSelector((state: RootState) => state.cart.items);
    console.log(cartItems)

    const calculateTotal = () => {
        return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    };

    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const { data: userData } = useSWR(
        userId ? `${process.env.NEXT_PUBLIC_USER_API}${userId}` : null,
        fetcher
    );

    const handleSubmitCart = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userId) {
            try {
                if (paymentMethod === 'COD') {
                    if (address.trim().length < 5) {
                        toast.error('Hãy nhập địa chỉ hợp lệ');
                        return;
                    }

                    const userName = userData?.name;
                    const userPhone = userData?.phone;

                    await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            cartItems: cartItems,
                            total: calculateTotal(),
                            userId: userId,
                            userName: userName,
                            userPhone: userPhone,
                            address: address,
                            paymentMethod: paymentMethod,
                        }),
                    });

                    for (const item of cartItems) {
                        await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}updateQuantity`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                id: item._id,
                                quantity: -item.quantity,
                            }),
                        });
                    }

                    dispatch(clearCart());
                    toast.success('Đặt hàng thành công');
                }

                if (paymentMethod === 'Thanh toán trực tuyến') {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API}pay`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            cartItems: cartItems,
                            total: calculateTotal(),
                            userId: userId,
                        }),
                    });

                    const { data: redirect } = await response.json();

                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        toast.error('Không tìm thấy đường link thanh toán');
                    }
                }
            } catch (error) {
                console.log(error);
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } else {
            router.push('/login');
        }
    };

    const addAddress = async () => {
        if (userData?.address) {
            setAddress(userData.address);
        }
    };

    return (
        <>
            <div className='cart container'>
                {cartItems.length === 0 ? (
                    <div className='noItem d-flex flex-column align-items-center justify-content-center vh-100'>
                        <i className="bi bi-bag-x mb-3" style={{ fontSize: '3rem' }}></i>
                        <p className='mb-3'>Không có sản phẩm nào trong giỏ hàng.</p>
                        <a className='btn btn-outline-dark' href='/'>Tiếp tục mua sắm</a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitCart}>
                        <h1 className='mb-3'>Thông tin đơn hàng</h1>
                        <div className='row'>
                            <Table striped bordered hover responsive="md">
                                <thead>
                                    <tr>
                                        <th>Tên Sản Phẩm</th>
                                        <th>Giá</th>
                                        <th>Số Lượng</th>
                                        <th>Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item: any) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{FormatNumber(item.price)} đ</td>
                                            <td>{item.quantity}</td>
                                            <td>{FormatNumber(item.price * item.quantity)} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td>Tổng:</td>
                                        <td>{FormatNumber(calculateTotal())} đ</td>
                                    </tr>
                                </tfoot>
                            </Table>
                            <div className='mt-4 p-0'>
                                {localStorage.getItem('id') && paymentMethod === 'COD' && (
                                    <div className="input-group mb-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Chọn địa chỉ nhận hàng"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            onChange={(e) => setAddress(e.target.value)}
                                            value={address}
                                        />
                                        <div className="input-group-append">
                                            <button onClick={addAddress} className="btn btn-outline-dark" type="button">
                                                Sử dụng địa chỉ mặc định
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6 border p-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="exampleRadios"
                                        id="exampleRadios1"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                        Thanh toán COD
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="exampleRadios"
                                        id="exampleRadios2"
                                        value="online"
                                        checked={paymentMethod === 'Thanh toán trực tuyến'}
                                        onChange={() => setPaymentMethod('Thanh toán trực tuyến')}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Thanh toán trực tuyến
                                    </label>
                                </div>
                            </div>
                            <div className="paymentButton col-md-6 border p-3 text-center">
                                {paymentMethod === 'COD' && (
                                    <button type="submit" className="btn btn-warning">
                                        Thanh toán
                                    </button>
                                )}
                                {paymentMethod === 'Thanh toán trực tuyến' && (
                                    <button type="submit" className="btn btn-warning">
                                        Thanh toán Paypal
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>

        </>
    );
};

export default Payment;
