'use client';

import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { checkEmail, checkPhone, FormatNumber, checkOrderStatus, FormatDate, FormatString } from '@/utils';

interface IProps {
    order: IOrder;
}

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

const UserDetail: React.FC<IProps> = ({ order }) => {
    const router = useRouter();
    const { id } = useParams();

    const [showInfo, setShowInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string | undefined>();
    const [orderDetail, setOrderDetail] = useState<IOrder | null>(null);

    const [initialName, setInitialName] = useState<string>('');
    const [initialPhone, setInitialPhone] = useState<string>('');
    const [initialEmail, setInitialEmail] = useState<string>('');
    const [initialAddress, setInitialAddress] = useState<string>('');

    const [updateName, setUpdateName] = useState<string>(initialName);
    const [updatePhone, setUpdatePhone] = useState<string>(initialPhone);
    const [updateEmail, setUpdateEmail] = useState<string>(initialEmail);
    const [updateAddress, setUpdateAddress] = useState<string>(initialAddress);

    const [currentPassword, setCurrentPassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { data: user, mutate: mutateUser } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_USER_API}${id}` : null,
        fetcher,
        {
            onSuccess: (data) => {

                setInitialName(data.name);
                setInitialPhone(data.phone);
                setInitialEmail(data.email);
                setInitialAddress(data.address);

                setUpdateName(data.name);
                setUpdateEmail(data.email);
                setUpdatePhone(data.phone);
                setUpdateAddress(data.address);
            },
        }
    );

    const { data: orders, error, mutate: mutateOrders } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_ORDER_API}user/${id}` : null,
        fetcher
    );

    const handleShowInfo = () => setShowInfo(true);
    const handleCloseInfo = () => setShowInfo(false);
    const handleShowPassword = () => setShowPassword(true);
    const handleClosePassword = () => setShowPassword(false);
    const handleShowOrder = () => setShowOrder(true);
    const handleCloseOrder = () => setShowOrder(false);

    const updateUserInfo = async (e: React.FormEvent) => {
        e.preventDefault();

        setUpdateName(FormatString(updateName));
        setUpdateAddress(FormatString(updateAddress));
        setUpdateEmail(FormatString(updateEmail));
        setUpdatePhone(FormatString(updatePhone));

        if (!updateName || !updateEmail || !updatePhone || !updateAddress) {
            toast.error('Không được để trống');
            return;
        }
        if (!checkPhone(updatePhone)) {
            toast.error('Hãy nhập số điện thoại hợp lệ');
            return;
        }
        if (!checkEmail(updateEmail)) {
            toast.error('Hãy nhập email hợp lệ');
            return;
        }
        if (updateAddress.trim().length < 5) {
            toast.error('Hãy nhập địa chỉ hợp lệ');
            return;
        }

        try {
            const existingUser = await fetcher(`${process.env.NEXT_PUBLIC_USER_API}find?email=${updateEmail}`);

            if (existingUser._id && existingUser._id !== id) {
                toast.error('Email đã được đăng ký');
                return;
            }

            const updatedFields: { [key: string]: string } = {};
            if (updateName !== initialName) updatedFields.name = updateName;
            if (updatePhone !== initialPhone) updatedFields.phone = updatePhone;
            if (updateEmail !== initialEmail) updatedFields.email = updateEmail;
            if (updateAddress !== initialAddress) updatedFields.address = updateAddress;
            updatedFields.role = 'user';

            if (Object.keys(updatedFields).length > 0) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        id,
                        ...updatedFields,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Update failed');
                }

                await mutateUser();
                toast.success('Cập Nhật Thành Công');
                handleCloseInfo();
            } else {
                toast.info('Không có thay đổi nào để cập nhật');
            }
        } catch (error) {
            console.error('Update Error:', error);
            toast.error('Cập Nhật Thất Bại');
        }
    };

    const updateUserPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!updatePassword || !currentPassword || !confirmPassword) {
            toast.error('Không được để trống');
            return;
        }
        if (CryptoJS.MD5(currentPassword).toString() !== user?.password) {
            toast.error('Mật khẩu hiện tại không chính xác');
            return;
        }
        if (confirmPassword !== updatePassword) {
            toast.error('Xác nhận mật khẩu không chính xác');
            return;
        }

        await fetch(`${process.env.NEXT_PUBLIC_USER_API}update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                id,
                password: CryptoJS.MD5(updatePassword).toString(),
            }),
        });

        await mutateUser();
        toast.success('Đổi Mật Khẩu Thành Công');
        setUpdatePassword('');
        setCurrentPassword('');
        setConfirmPassword('');
        handleClosePassword();
    };

    const fetchDataModal = async (e: React.MouseEvent, orderId: string) => {
        e.preventDefault();
        setCurrentOrderId(orderId);

        const detailOrder = await fetcher(
            `${process.env.NEXT_PUBLIC_ORDER_API}${orderId}`
        );
        setOrderDetail(detailOrder);
        handleShowOrder();
    };

    const cancelOrder = async () => {
        if (!orderDetail || !orderDetail.order_items) {
            toast.error('Không tìm thấy chi tiết đơn hàng');
            return;
        }

        await fetch(`${process.env.NEXT_PUBLIC_ORDER_API}update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                orderId: currentOrderId,
                status: 'aborted',
            }),
        });

        for (const item of orderDetail.order_items) {
            await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}updateQuantity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: item.product_id,
                    quantity: item.quantity,
                }),
            });
        }

        await mutateOrders();
        toast.success('Hủy Đơn Hàng Thành Công');
        handleCloseOrder();
    };

    const displayStatus = (status: string) => {
        if (status === 'open') {
            return (
                <Button variant="danger" onClick={cancelOrder}>
                    Hủy Đơn Hàng
                </Button>
            );
        } else if (status === 'aborted') {
            return <h5 className="text-danger">Đơn Hàng Đã Bị Hủy</h5>;
        } else {
            return <h5 className="text-success">Đơn Hàng Đã Thanh Toán</h5>;
        }
    };

    useEffect(() => {
        if (!id) {
            router.push('/login');
        }
    }, [id, router]);

    if (error)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
        <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
    </div>;

    if (!orders)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Đang tải, vui lòng chờ...</p>
    </div>;

    return (
        <>
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body text-center">
                                <img
                                    src="/image/user.png"
                                    alt="avatar"
                                    className="rounded-circle img-fluid"
                                    style={{ width: '150px' }}
                                />
                                <h5 className="my-3">{user?.name}</h5>
                                <Button variant="primary" onClick={handleShowInfo} className="me-2">
                                    Cập nhật thông tin
                                </Button>
                                <Button variant="secondary" onClick={handleShowPassword}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-sm-4">
                                        <p className="mb-0">Họ Và Tên</p>
                                    </div>
                                    <div className="col-sm-8">
                                        <p className="text-muted mb-0">{user?.name}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-4">
                                        <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-8">
                                        <p className="text-muted mb-0">{user?.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-4">
                                        <p className="mb-0">Số Điện Thoại</p>
                                    </div>
                                    <div className="col-sm-8">
                                        <p className="text-muted mb-0">{user?.phone}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-4">
                                        <p className="mb-0">Địa Chỉ</p>
                                    </div>
                                    <div className="col-sm-8">
                                        <p className="text-muted mb-0">{user?.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Tổng giá trị</th>
                                    <th>Tình trạng</th>
                                    <th>Thời gian đặt hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order: any) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{FormatNumber(order.total)}đ</td>
                                            <td>{checkOrderStatus(order.status)}</td>
                                            <td>{FormatDate(order.orderDate)}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={(e) => fetchDataModal(e, order._id)}
                                                >
                                                    Chi Tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center">Không có đơn hàng nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            <Modal show={showInfo} onHide={handleCloseInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUserInfo}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và Tên</Form.Label>
                            <Form.Control
                                type="text"
                                value={updateName}
                                onChange={(e) => setUpdateName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={updateEmail}
                                onChange={(e) => setUpdateEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số Điện Thoại</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatePhone}
                                onChange={(e) => setUpdatePhone(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa Chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                value={updateAddress}
                                onChange={(e) => setUpdateAddress(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Cập Nhật
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showPassword} onHide={handleClosePassword}>
                <Modal.Header closeButton>
                    <Modal.Title>Đổi Mật Khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUserPassword}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={updatePassword}
                                onChange={(e) => setUpdatePassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Đổi Mật Khẩu
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showOrder} onHide={handleCloseOrder} animation={true} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thông Tin Đơn Hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Mã đơn hàng: {currentOrderId}</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail?.order_items?.map((item: any) => (
                                <tr key={item.product_id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{FormatNumber(item.price)}</td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan={3}>Không có sản phẩm nào</td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>{displayStatus(orderDetail?.status || '')}</Modal.Footer>
            </Modal>
        </>
    );
};

export default UserDetail;
