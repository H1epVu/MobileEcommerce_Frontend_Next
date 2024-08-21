'use client'

import { useState } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { FormatNumber } from '@/utils';

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

const DetailOrder = () => {
    const router = useRouter();
    const { id } = useParams();
    const orderId = id;
    const [address, setAddress] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const { data: order, mutate } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_ORDER_API}${id}` : null,
        fetcher
    );

    const list = order?.order_items || [];

    const checkStatus = (status: string) => {
        if (status === "aborted") {
            return <h3 className="text-danger fw-bold">Đơn hàng đã bị hủy</h3>;
        } else if (status === "closed") {
            return <h3 className="text-success fw-bold">Đơn hàng đã được thanh toán</h3>;
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const updateAddress = async (id: string) => {
        if (address.length < 3) {
            toast.error('Hãy nhập địa chỉ hợp lệ');
        } else {
            await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}update`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: id, status: 'open', address }),
            });
            toast.success('Cập nhật địa chỉ đơn hàng thành công!')
            mutate(`${process.env.NEXT_PUBLIC_ORDER_API}${id}`)
            setModalOpen(false);
        }
    };

    const cancel = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}update`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: id, status: 'aborted', address }),
        });

        for (const item of list) {
            await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}updateQuantity`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: item.product_id, quantity: item.quantity }),
            });
        }
        toast.success('Hủy đơn hàng thành công!')
        mutate(`${process.env.NEXT_PUBLIC_ORDER_API}${id}`)
    };

    const confirm = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}update`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: id, status: 'closed', address }),
        });
        toast.success('Xác nhận đơn hàng thành công!')
        mutate(`${process.env.NEXT_PUBLIC_ORDER_API}${id}`)
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h3 className="mb-3 mb-md-0 text-truncate" style={{ maxWidth: 'calc(100% - 150px)' }}>
                    Đơn hàng {id}
                </h3>
                <Link href="/admin/order" passHref>
                    <Button variant="danger">Quay Lại</Button>
                </Link>
            </div>
            <div className="row mb-4">
                <div className="col-12 col-md-7">
                    <div className="mb-3 d-flex justify-content-between">
                        <h5>Tên Khách Hàng:</h5>
                        <p>{order?.userName}</p>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                        <h5>Số Điện Thoại:</h5>
                        <p>{order?.userPhone}</p>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                        <h5>Địa Chỉ Nhận Hàng:</h5>
                        <p>{order?.address}</p>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                        <h5>Tổng Giá Trị Đơn Hàng:</h5>
                        <p>{order?.total}đ</p>
                    </div>
                    <div className="mb-4">
                        <h5>Danh Sách Chi tiết:</h5>
                    </div>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên Sản Phẩm</th>
                        <th scope="col">Số Lượng</th>
                        <th scope="col">Thành Tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item: any, index: number) => (
                        <tr key={item.product_id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{FormatNumber(item.price)}đ</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-4">
                {order?.status === "open" && (
                    <div className="d-flex flex-column flex-md-row align-items-start">
                        <Button variant="danger" onClick={() => cancel(orderId as string)}>Hủy Đơn Hàng</Button>
                        <div className="d-flex mt-3 mt-md-0">
                            <Button variant="primary" onClick={handleOpenModal} className='mx-3'>
                                Cập Nhật Địa Chỉ
                            </Button>
                            <Modal show={isModalOpen} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Cập Nhật</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Địa Chỉ Mới</Form.Label>
                                            <Form.Control
                                                type="text"
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder='Nhập địa chỉ mới'
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => updateAddress(orderId as string)}>
                                        Cập Nhật
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <Button variant="success" onClick={() => confirm(orderId as string)}>Xác Nhận Đã Thanh Toán</Button>
                        </div>
                    </div>
                )}
            </div>

            {checkStatus(order?.status)}
        </div>
    );
};

export default DetailOrder;