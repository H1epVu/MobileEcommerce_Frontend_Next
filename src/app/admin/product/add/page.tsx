'use client'

import { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const AddMobile = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [demoImage, setDemoImage] = useState<string | null>(null);

    useEffect(() => {
        setDemoImage(imageUrl);
    }, [imageUrl]);

    const handleAddMobile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}/add`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price,
                    imageUrl,
                    description,
                    quantity,
                    status: 'open',
                }),
            });

            toast.success('Thêm thành công');
            setTimeout(() => {
                router.push('/admin/product');
            }, 1000);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Thêm không thành công');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Thêm Sản Phẩm</h3>
                <Link href="/admin/product" passHref>
                    <Button variant="danger">Quay Lại</Button>
                </Link>
            </div>
            <div className="text-center mb-4">
                {demoImage && (
                    <img
                        src={demoImage}
                        alt="Demo"
                        style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
                    />
                )}
            </div>
            <Form onSubmit={handleAddMobile}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPrice">
                    <Form.Label>Giá</Form.Label>
                    <Form.Control
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formImageUrl">
                    <Form.Label>URL Hình ảnh</Form.Label>
                    <Form.Control
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formQuantity">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="success" type="submit">
                    Thêm
                </Button>
            </Form>
        </Container>
    );
};

export default AddMobile;