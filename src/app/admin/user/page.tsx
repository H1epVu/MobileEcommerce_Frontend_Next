'use client'

import { useState } from 'react';
import { Button, Table, Form, Container } from 'react-bootstrap';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

const User = () => {
    const [searchId, setSearchId] = useState('');

    const { data: users, error } = useSWR(
        process.env.NEXT_PUBLIC_USER_API,
        fetcher
    );

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId) return;

        try {
            const userData = await fetch(
                `${process.env.NEXT_PUBLIC_USER_API}/${searchId}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            ).then((res) => res.json());

            mutate(process.env.NEXT_PUBLIC_USER_API, userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchId(e.target.value);
    };

    const deleteUser = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_USER_API}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            mutate(process.env.NEXT_PUBLIC_USER_API);

            toast.success('Xóa thành công');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Xóa không thành công');
        }
    };

    if (error)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
        <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
    </div>;

    if (!users)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Đang tải, vui lòng chờ...</p>
    </div>;;

    return (
        <Container>
            <h2 className='mt-5 mb-5'>Quản lý người dùng</h2>
            <Form onSubmit={handleSearch} className="mb-4">
                <Form.Group className="d-flex align-items-center">
                    <Form.Control
                        type="search"
                        placeholder="Nhập tên sản phẩm"
                        aria-label="Search"
                        value={searchId}
                        onChange={handleInputChange}
                        className="flex-grow-1 me-2"
                    />
                    <Button variant="outline-success" type="submit">
                        <i className="bi bi-search"></i>
                    </Button>
                </Form.Group>
            </Form>
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th className="text-center">
                                <Link href="/admin/user/add" passHref>
                                    <Button variant="outline-success">Thêm</Button>
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <Link href={`/admin/user/${user._id}`} passHref>
                                                <Button variant="primary" className="mx-2">
                                                    Chỉnh sửa
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                onClick={() => deleteUser(user._id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default User;