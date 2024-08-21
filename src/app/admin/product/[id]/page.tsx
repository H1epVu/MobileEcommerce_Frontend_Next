'use client'

import { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UpdateProduct = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data: product, error } = useSWR(id ? `${process.env.NEXT_PUBLIC_PRODUCT_API}/detail/${id}` : null, fetcher);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [demoImage, setDemoImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImageUrl(product.imageUrl);
      setDescription(product.description);
      setQuantity(product.quantity);
      setStatus(product.status);
      setDemoImage(product.imageUrl);
    }
  }, [product]);

  const handleUpdateproduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_API}/update`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          price,
          imageUrl,
          description,
          quantity,
          status,
        }),
      });

      toast.success('Cập nhật thành công');
      mutate(`${process.env.NEXT_PUBLIC_PRODUCT_API}/detail/${id}`);
      router.push('/admin/product');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Cập nhật không thành công');
    }
  };

  if (error)
    return
  <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
    <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
    <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
    <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
  </div>;

  if (!product)
    return
  <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className='mt-3'>Đang tải, vui lòng chờ...</p>
  </div>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Cập Nhật Sản Phẩm</h3>
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

      <Form onSubmit={handleUpdateproduct}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Tên</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Giá</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập giá"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formImageUrl">
          <Form.Label>URL Hình ảnh</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập URL hình ảnh"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nhập mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formQuantity">
          <Form.Label>Số lượng</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStatus">
          <Form.Label>Trạng thái</Form.Label>
          <Form.Control
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="1">Đang mở</option>
            <option value="0">Ngưng kinh doanh</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Cập nhật
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateProduct;