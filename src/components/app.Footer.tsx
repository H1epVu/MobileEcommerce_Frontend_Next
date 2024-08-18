import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="py-5 text-center bg-light">
      <Container>
        <p className="text-muted">Trang web chỉ phục vụ cho mục đích học tập</p>
        <p className="text-muted">© 2024 Vũ Đình Hiệp</p>
      </Container>
    </footer>
  );
};

export default Footer;
