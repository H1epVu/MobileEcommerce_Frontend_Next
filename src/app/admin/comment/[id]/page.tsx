'use client'

import { useParams, useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormatDate } from '@/utils';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CommentDetail = () => {
    const router = useRouter();
    const { id } = useParams();
    const { mutate } = useSWRConfig();
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

    const { data, error } = useSWR(id ? `${process.env.NEXT_PUBLIC_COMMENT_API}prod/${id}` : null, fetcher);

    const comment = Array.isArray(data) && data.length > 0 ? data[0] : null;
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

    if (error)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
        <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
    </div>;

    if (!data)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Đang tải, vui lòng chờ...</p>
    </div>;

    if (!comment)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Sản phẩm chưa có bình luận nào.</p>
    </div>;

    return (
        <>
            <div className='container'>
                <div className='mt-5 mb-5 p-3'>
                    <h1 className='mb-4'>Bình luận</h1>
                    <div className='mb-1'>
                        <strong>{comment.email}</strong>
                    </div>
                    <div className='mb-1'>
                        <p>{comment.content}</p>
                        <small className="text-muted">Posted on: {FormatDate(comment.createdAt)}</small>
                    </div>
                    <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleDelete(comment._id)}
                    >
                        Delete
                    </button>
                    <div>
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
                            <div></div>
                        )}
                    </div>
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
                </div>
            </div>
        </>
    );
};

export default CommentDetail;