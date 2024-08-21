'use client'

import { useState } from 'react';
import { Button, Table, Container, Form } from 'react-bootstrap';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import { FormatNumber } from '@/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Mobile = () => {
    const [searchItem, setSearchItem] = useState('');
    const { data: products, error } = useSWR(process.env.NEXT_PUBLIC_PRODUCT_API, fetcher);

    const handleDelete = async (itemId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}delete/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            mutate(process.env.NEXT_PUBLIC_PRODUCT_API);
            toast.success('Xóa sản phẩm thành công');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: searchResults } = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}?search=${searchItem}`).then((res) => res.json());
        mutate(`${process.env.NEXT_PUBLIC_PRODUCT_API}/products`, searchResults, false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchItem(e.target.value);
    };

    if (error)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
        <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
    </div>;

    if (!products)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Đang tải, vui lòng chờ...</p>
    </div>;

    return (
        <Container>
            <h2 className='mt-5 mb-5'>Quản lý sản phẩm</h2>
            <Form onSubmit={handleSearch} className="mb-4">
                <Form.Group className="d-flex align-items-center">
                    <Form.Control
                        type="search"
                        placeholder="Nhập tên sản phẩm"
                        aria-label="Search"
                        value={searchItem}
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
                        <tr className='text-center align-middle'>
                            <th>IMG</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>
                                <Link href={`/admin/product/add`} passHref>
                                    <Button variant="outline-success">Thêm</Button>
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item: any) => (
                            <tr key={item._id} className="align-middle">
                                <td>
                                    <img
                                        className="img-fluid rounded mx-auto d-block"
                                        src={item.imageUrl}
                                        alt=""
                                        style={{ maxWidth: '80px', maxHeight: '80px' }}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td className='text-center'>{FormatNumber(item.price)}đ</td>
                                <td className='text-center'>{item.quantity}</td>
                                <td className='text-center'>{item.status === '0' ? 'Ngưng kinh doanh' : 'Đang mở'}</td>
                                <td className='text-center'>
                                    <div className="d-flex justify-content-center">
                                        <Link href={`/admin/product/${item._id}`} passHref>
                                            <Button variant="primary" className="me-2">Chỉnh sửa</Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => handleDelete(item._id)}>Xóa</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default Mobile;