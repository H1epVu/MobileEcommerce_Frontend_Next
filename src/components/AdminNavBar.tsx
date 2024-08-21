'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Navbar, Nav, Button } from 'react-bootstrap';

const AdminNavBar: React.FC = () => {
    const [id, setId] = useState<string | null>(null);

    // Function to handle logout
    const logout = () => {
        localStorage.clear();
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
        });
        setId(null);
        window.location.href = '/';
    };

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        setId(storedId);
    }, []);

    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Brand href="/admin" className="ms-3">ADMIN</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto mb-2 mb-md-0">
                <Nav.Link as={Link} href="/admin/user" className="text-center">Người Dùng</Nav.Link>
                    <Nav.Link as={Link} href="/admin/product" className="text-center">Sản Phẩm</Nav.Link>
                    <Nav.Link as={Link} href="/admin/order" className="text-center">Đơn Hàng</Nav.Link>
                    <Nav.Link as={Link} href="/admin/comment" className="text-center">Bình Luận</Nav.Link>
                </Nav>
                <div className="d-flex justify-content-center align-items-center me-3 mt-2 mt-md-0">
                    {id ? (
                        <Button variant="danger" onClick={logout}>Đăng xuất</Button>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="light" className="me-2">Đăng nhập</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="light">Đăng ký</Button>
                            </Link>
                        </>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AdminNavBar;