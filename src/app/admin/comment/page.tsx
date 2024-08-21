'use client'

import useSWR from 'swr';
import Link from 'next/link';
import { Table } from 'react-bootstrap';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Comment = () => {
    const { data: products, error } = useSWR(process.env.NEXT_PUBLIC_PRODUCT_API as string, fetcher);

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
        <div className='container'>
            <h2 className='mt-5 mb-5'>Quản lý bình luận</h2>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center align-middle'>
                        <th>IMG</th>
                        <th>Tên sản phẩm</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod: any) => (
                        <tr key={prod._id} className="text-center align-middle">
                            <td><img className="rounded mx-auto d-block" src={prod.imageUrl} alt="" style={{ width: '80px', height: '80px' }} /></td>
                            <td>{prod.name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <div>
                                    <Link href={`/admin/comment/${prod._id}`} className='btn btn-primary'>
                                        Chi tiết
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Comment;