'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const UserNavBar: React.FC = () => {
    const [id, setId] = useState<string | null>(null);
    // const role = localStorage.getItem('role')

    const login = () => {
        window.location.href = '/login';
    };

    const register = () => {
        window.location.href = '/register';
    };

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
    }, [id])

    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Brand href="/" className="ms-3">Mobile Ecommerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto mb-2 mb-md-0">
                    <Nav.Link as={Link} href="/" className="text-center">Trang Chủ</Nav.Link>
                    <Nav.Link as={Link} href="/cart" className="text-center">Giỏ Hàng</Nav.Link>
                    {id && (
                        <Nav.Link as={Link} href={`/user/${id}`} className="text-center">Tài khoản</Nav.Link>
                    )}
                </Nav>
                <div className="d-flex justify-content-center align-items-center me-3 mt-2 mt-md-0">
                    {!id ? (
                        <>
                            <Button variant="light" className="me-2" onClick={login}>Đăng nhập</Button>
                            <Button variant="light" onClick={register}>Đăng ký</Button>
                        </>
                    ) : (
                        <Button variant="danger" onClick={logout}>Đăng xuất</Button>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default UserNavBar;