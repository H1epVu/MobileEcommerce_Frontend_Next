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
            <Container>
                <Navbar.Brand href="/">Mobile Ecommerce</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} href="/">Trang Chủ</Nav.Link>
                        <Nav.Link as={Link} href="/cart">Giỏ Hàng</Nav.Link>
                        <Nav.Link as={Link} href="/profile">Tài khoản</Nav.Link>
                    </Nav>
                    <div className="d-flex">
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
            </Container>
        </Navbar>
    );
};

export default NavScroll;