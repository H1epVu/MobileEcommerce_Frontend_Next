'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useUserUpdate } from '@/hooks/useUserUpdate';

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

const UpdateUser = () => {
    const router = useRouter();
    const { id } = useParams();

    const [initialName, setInitialName] = useState<string>('');
    const [initialPhone, setInitialPhone] = useState<string>('');
    const [initialEmail, setInitialEmail] = useState<string>('');
    const [initialAddress, setInitialAddress] = useState<string>('');
    const [initialRole, setInitialRole] = useState<string>('user');


    const [updateName, setUpdateName] = useState<string>(initialName);
    const [updatePhone, setUpdatePhone] = useState<string>(initialPhone);
    const [updateEmail, setUpdateEmail] = useState<string>(initialEmail);
    const [updateAddress, setUpdateAddress] = useState<string>(initialAddress);
    const [updateRole, setUpdateRole] = useState<string>(initialRole);

    const { data: currentUser, error } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_USER_API}${id}` : null,
        fetcher,
        {
            onSuccess: (data) => {

                setInitialName(data.name);
                setInitialPhone(data.phone);
                setInitialEmail(data.email);
                setInitialAddress(data.address);
                setInitialRole(data.role);

                setUpdateName(data.name);
                setUpdateEmail(data.email);
                setUpdatePhone(data.phone);
                setUpdateAddress(data.address);
                setUpdateRole(data.role);

            }
        }
    );

    const { updateUser } = useUserUpdate({
        onSuccess: () => {
            router.push('/admin/user');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateUser({
            id,
            updateName,
            updatePhone,
            updateEmail,
            updateAddress,
            updateRole,
            initialName,
            initialPhone,
            initialEmail,
            initialAddress,
            initialRole
        });
    };

    if (error)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
        <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
    </div>;

    if (!currentUser)
        return
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className='mt-3'>Đang tải, vui lòng chờ...</p>
    </div>;

    return (
        <div className="container">
            <div className="row">
                <div className="header-laptop mt-5 d-flex justify-content-between">
                    <h3>Cập Nhật Người Dùng</h3>
                    <Link className="btn btn-danger" href="/admin/user">Quay Lại</Link>
                </div>
                <div className="mt-3">
                    <form onSubmit={handleSubmit}>
                        <div className="col">
                            <div className="col-md-6" style={{ width: "100%" }}>
                                <div className="form-group">
                                    <label className="control-label mt-3 mb-3">Tên:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={updateName}
                                        onChange={(e) => setUpdateName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="control-label mt-3 mb-3">Số Điện Thoại:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={updatePhone}
                                        onChange={(e) => setUpdatePhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="control-label mt-3 mb-3">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={updateEmail}
                                        onChange={(e) => setUpdateEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="control-label mt-3 mb-3">Địa Chỉ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={updateAddress}
                                        onChange={(e) => setUpdateAddress(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="mt-3 mb-3" htmlFor="Status">Phân Quyền:</label>
                                    <select
                                        className="form-control mb-3"
                                        value={updateRole}
                                        onChange={(e) => setUpdateRole(e.target.value)}
                                    >
                                        <option value="user">Người Dùng</option>
                                        <option value="admin">Quản Trị Viên</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group d-flex justify-content-end">
                                    <button className="btn btn-success float-right" type="submit">
                                        Cập Nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;