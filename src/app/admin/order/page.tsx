'use client'

import { useState } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import useSWR, { mutate } from 'swr';
import { FormatDate, FormatNumber, checkOrderStatus } from '@/utils';

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

const Orders = () => {
    const [searchId, setSearchId] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const url = status
        ? `${process.env.NEXT_PUBLIC_ORDER_API}?status=${status}`
        : `${process.env.NEXT_PUBLIC_ORDER_API}${searchId ? `/${searchId}` : ''}`;

    const { data: orders, error } = useSWR(url, fetcher);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        mutate(url);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchId(e.target.value);
    };

    const handleSortChange = (option: string) => {
        setStatus(option);
    };

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
        <div className="container">
            <h2 className="mt-5 mb-5">Quản lý đơn hàng</h2>

            <div className="search-bar mb-4">
                <form className="form-inline" onSubmit={handleSearch}>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Nhập mã đơn hàng"
                            aria-label="Search"
                            value={searchId}
                            onChange={handleInputChange}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-success" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="order-sort-dropdown mb-4">
                <DropdownButton id="order-sort-dropdown" title="Trạng thái">
                    <Dropdown.Item onClick={() => handleSortChange('open')}>Chờ xử lý</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('closed')}>Đã hoàn thành</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('aborted')}>Đã hủy</Dropdown.Item>
                </DropdownButton>
            </div>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Mã Đơn Hàng</th>
                            <th>Tên Khách Hàng</th>
                            <th>Tổng Giá Trị</th>
                            <th>Tình Trạng</th>
                            <th>Ngày Đặt Hàng</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) ? (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.userName}</td>
                                    <td>{FormatNumber(order.total)}đ</td>
                                    <td>{checkOrderStatus(order.status)}</td>
                                    <td>{FormatDate(order.orderDate)}</td>
                                    <td className="text-center">
                                        <a href={`/admin/order/${order._id}`} className="btn btn-primary">Chi Tiết</a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key={orders._id}>
                                <td>{orders._id}</td>
                                <td>{orders.userName}</td>
                                <td>{FormatNumber(orders.total)}đ</td>
                                <td>{checkOrderStatus(orders.status)}</td>
                                <td>{FormatDate(orders.orderDate)}</td>
                                <td className="text-center">
                                    <a href={`/admin/order/${orders._id}`} className="btn btn-primary">Chi Tiết</a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>

    );
};

export default Orders;