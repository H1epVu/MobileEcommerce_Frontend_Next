'use client'

import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') || ''
    }
}).then(res => res.json());

const PaymentSuccess: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [PayerID, setPayerID] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [paymentHandled, setPaymentHandled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const queryParams = new URLSearchParams(window.location.search);
            setPaymentId(queryParams.get('paymentId'));
            setPayerID(queryParams.get('PayerID'));
            setToken(localStorage.getItem('token') || '');
        }
    }, []);

    console.log(paymentId, PayerID)

    const { data: userData, error: userError } = useSWR(
        typeof window !== 'undefined' && localStorage.getItem('id')
            ? `${process.env.NEXT_PUBLIC_USER_API}${localStorage.getItem('id')}`
            : null,
        fetcher
    );

    const { data: paymentData, error: paymentError } = useSWR(
        paymentId && PayerID
            ? `${process.env.NEXT_PUBLIC_PAYMENT_API}success?paymentId=${paymentId}&PayerId=${PayerID}`
            : null,
        fetcher
    );

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            if (userData && paymentData && !paymentHandled) {
                setPaymentHandled(true);

                const storedData = localStorage.getItem('order');
                if (storedData) {
                    const { cartItems: storedCartItems, total: storedTotal } = JSON.parse(storedData);

                    const localCartItems = storedCartItems;
                    const localTotal = storedTotal;

                    setCartItems(localCartItems);
                    setTotal(localTotal);

                    try {
                        const userName = userData.name;
                        const userPhone = userData.phone;

                        const address = `${paymentData.payment.payer.payer_info.shipping_address.line1}, ${paymentData.payment.payer.payer_info.shipping_address.city}`;
                        const paymentMethod = paymentData.payment.payer.payment_method;

                        await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}add`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                cartItems: localCartItems,
                                total: localTotal,
                                userId: localStorage.getItem('id'),
                                userName,
                                userPhone,
                                address,
                                paymentMethod,
                            }),
                        });

                        await Promise.all(localCartItems.map(async (item: any) =>
                            fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}updateQuantity`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    id: item._id,
                                    quantity: -item.quantity,
                                }),
                            })
                        ));

                        localStorage.removeItem('order');
                        toast.success('Đặt hàng thành công');

                    } catch (error) {
                        console.error(error);
                        toast.error('Có lỗi xảy ra khi xử lý đơn hàng.');
                    }
                } else {
                    toast.error('Không tìm thấy dữ liệu đơn hàng trong localStorage.');
                }
            } else if (userError || paymentError) {
                toast.error('Có lỗi xảy ra khi lấy dữ liệu.');
            }
        };

        handlePaymentSuccess();
    }, [userData, paymentData, userError, paymentError, token, paymentHandled]);

    return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
                <i className="bi bi-bag-x" style={{ fontSize: '3rem' }}></i>
                <p className='mt-3'>Không có sản phẩm nào trong giỏ hàng.</p>
                <a className='btn btn-outline-dark' href='/'>Tiếp tục mua sắm</a>
            </div>
        </>
    );
};

export default PaymentSuccess;