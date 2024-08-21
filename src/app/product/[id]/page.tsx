'use client'

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from "react-toastify";
import { FormatNumber, FormatDate } from '@/utils';
import { useDispatch } from 'react-redux';
import { addItem } from '@/redux/slice';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url, {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') || ''
    }
}).then(res => res.json());

const Detail: React.FC<{ prod: IProd }> = ({ prod }) => {
    const router = useRouter();
    const { id } = useParams();
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();
    const { mutate } = useSWRConfig();
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

    // Handle Product
    const { data: product, error: productError } = useSWR<IProd>(
        id ? `${process.env.NEXT_PUBLIC_PRODUCT_API}detail/${id}` : null,
        fetcher
    );


    const handleAddQuantity = () => {
        if (product && quantity >= product.quantity) {
            toast.error("Số lượng không được vượt quá tồn kho!");
        } else {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    const handleMinusQuantity = () => {
        if (product && quantity <= 1) {
            toast.error("Số lượng phải lớn hơn 1");
        } else {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(addItem({
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
            }));
            toast.success("Thêm vào giỏ hàng thành công!");
        }
    };

    //Handle Comment
    const { data: commentsData } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_COMMENT_API}prod/${id}` : null,
        fetcher
    );

    const comment = Array.isArray(commentsData) && commentsData.length > 0 ? commentsData[0] : null;
    const replies = Array.isArray(comment?.replies) ? comment.replies : [];

    const userId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

    const handleReplyChange = (commentId: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [commentId]: value,
        }));
    };

    const handleReply = async (e: React.FormEvent<HTMLFormElement>, commentId: string) => {
        e.preventDefault();
        if (replyInputs[commentId].trim() === '') {
            toast.error('Không được để bình luận trống');
            return;
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_COMMENT_API}reply/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    cmtId: commentId,
                    userId: userId,
                    email: 'ADMIN',
                    content: replyInputs[commentId],
                }),
            });

            toast.success('Đăng bình luận thành công!');
            setReplyInputs((prevInputs) => ({
                ...prevInputs,
                [commentId]: '',
            }));

            mutate(`${process.env.NEXT_PUBLIC_COMMENT_API}prod/${id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_COMMENT_API}delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            toast.success('Xóa bình luận thành công');
            router.push('/admin/comment');
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteReply = async (replyId: string, cmtId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_COMMENT_API}delete/${cmtId}/${replyId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            mutate(`${process.env.NEXT_PUBLIC_COMMENT_API}prod/${id}`);
            toast.success('Xóa bình luận thành công');
        } catch (error) {
            console.log(error);
        }
    };

    if (productError) {
        return (
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
                <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
                <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
                <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className='mt-3'>Đang tải, vui lòng chờ...</p>
            </div>
        );
    }

    return (
        <div className="detail py-5">
            <section className="py-5">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="row gx-4 gx-lg-5 align-items-center">
                        <div className="col-md-6">
                            <img className="img-fluid mb-5 mb-md-0" src={product.imageUrl} alt={product.name} />
                        </div>
                        <div className="col-md-6">
                            <h1 className="display-5 fw-bolder">{product.name}</h1>
                            <div className="fs-5 mb-3">
                                <span>{FormatNumber(product.price)} đ</span>
                            </div>
                            <p className="lead mb-4">{product.description}</p>
                            {product.status === "0" || product.quantity === 0 ? (
                                <button className="btn btn-outline-dark" type="button" disabled>
                                    <i className="bi bi-cart-fill me-1"></i> Hết Hàng
                                </button>
                            ) : (
                                <>
                                    <div className='mb-3'>
                                        <p className='fs-5 fw-bold'> Còn sẵn: {product.quantity} chiếc</p>
                                    </div>
                                    <div className="d-flex align-items-center mb-4">
                                        <button className='btn btn-outline-dark' onClick={handleMinusQuantity}> - </button>
                                        <div className="form-control text-center mx-2" style={{ maxWidth: '80px' }}>{quantity}</div>
                                        <button className='btn btn-outline-dark' onClick={handleAddQuantity}> + </button>
                                        <button className="btn btn-outline-dark ms-3" type="button" onClick={handleAddToCart}>
                                            <i className="bi bi-cart-fill me-1"></i> Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className='container'>
                <div className='mt-5 mb-5 p-3'>
                    <h1 className='mb-4'>Bình luận</h1>
                    {comment ? (
                        <>
                            {replies.length > 0 ? (
                                replies.map((reply: any) => (
                                    <div key={reply._id} className="border mt-3 mb-3 p-3">
                                        <div className='mb-1'>
                                            <strong>{reply.email}</strong>
                                        </div>
                                        <div className='mb-1'>
                                            <p>{reply.content}</p>
                                        </div>
                                        <div className='mb-1'>
                                            <small className="text-muted">Posted on: {FormatDate(reply.createdAt)}</small>
                                        </div>
                                        <button
                                            className="btn btn-danger btn-sm mt-2"
                                            onClick={() => handleDeleteReply(reply._id, comment._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="alert alert-secondary mt-3" role="alert">
                                    Chưa có bình luận nào được đăng tải.
                                </div>
                            )}
                            {userId ? (
                                <div>
                                    <form onSubmit={(e) => handleReply(e, comment._id)}>
                                        <div className="mt-3 mb-3">
                                            <textarea
                                                className="form-control"
                                                id="commentContent"
                                                rows={3}
                                                value={replyInputs[comment._id] || ''}
                                                onChange={(e) => handleReplyChange(comment._id, e)}
                                            ></textarea>
                                            <button type="submit" className="btn btn-primary btn-sm mt-3">Reply</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className='border rounded p-3'>
                                    <p>Đăng nhập để phản hồi bình luận này</p>
                                    <Link className="btn btn-dark" href={`/login`}>Login</Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="alert alert-secondary mt-3" role="alert">
                            Chưa có bình luận nào được đăng tải.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Detail;
