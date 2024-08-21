'use client'

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '@/redux/slice';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/navigation';
import { FormatNumber } from '@/utils';

const Cart = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: any) => state.cart.items);

    const calculateTotal = () => {
        return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    };

    const handleSubmitCart = (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem('id');
        if (userId) {
            const order = {
                cartItems: cartItems,
                total: calculateTotal(),
            };
            localStorage.setItem('order', JSON.stringify(order));
            router.push('/payment');
        } else {
            router.push('/login');
        }
    };

    return (
        <>
            <div className='container py-5'>
                {cartItems.length === 0 ? (
                    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
                        <i className="bi bi-bag-x" style={{ fontSize: '3rem' }}></i>
                        <p className='mt-3'>Không có sản phẩm nào trong giỏ hàng.</p>
                        <a className='btn btn-outline-dark' href='/'>Tiếp tục mua sắm</a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitCart}>
                        <Table striped bordered hover responsive="md">
                            <thead>
                                <tr>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Thành Tiền</th>
                                    <th style={{ textAlign: 'center' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item: any) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{FormatNumber(item.price)} đ</td>
                                        <td>{item.quantity}</td>
                                        <td>{FormatNumber(item.price * item.quantity)} đ</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className='btn btn-outline-danger'
                                                onClick={() => dispatch(removeItem(item._id))}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td>Tổng:</td>
                                    <td>{FormatNumber(calculateTotal())} đ</td>
                                </tr>
                            </tfoot>
                        </Table>
                        <div className="text-center mt-4">
                            <button
                                className='btn btn-dark py-2'
                                type='submit'
                            >
                                Mua Hàng
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default Cart;