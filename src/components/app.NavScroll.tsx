'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const NavScroll: React.FC = () => {
    const [id, setId] = useState<string | null>(null);

    const login = () => {
        window.location.href = '/login';
    };

    const register = () => {
        window.location.href = '/register';
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
        window.location.reload();
    };

    useEffect(() => {
        setId(localStorage.getItem('id'));
    }, []);

    return (
        <Navbar bg="dark" variant="dark" expand="md" fixed="top">
            <Navbar.Brand href="/" className="ms-3">Mobile Ecommerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto mb-2 mb-md-0">
                    <Nav.Link as={Link} href="/" className="text-center">Trang Chủ</Nav.Link>
                    <Nav.Link as={Link} href="/cart" className="text-center">Giỏ Hàng</Nav.Link>
                    <Nav.Link as={Link} href="/profile" className="text-center">Tài khoản</Nav.Link>
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

export default NavScroll;