import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="bg-body-tertiary text-body-secondary py-3">
            <Container className="text-center">
                <p className="mb-1">Trang web chỉ phục vụ cho mục đích học tập</p>
                <p className="mb-0">© 2024 Vũ Đình Hiệp</p>
            </Container>
        </footer>
    );
};

export default Footer;
