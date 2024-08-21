'use client'

import React, { useState, ChangeEvent, FormEvent } from "react";
import useSWR from "swr";
import { Button, Card, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import Link from "next/link";
import { FormatNumber } from "@/utils";

interface IProps {
  prods: IProd[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: React.FC<IProps> = ({ prods }) => {
  const [searchItem, setSearchItem] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: products = prods, error } = useSWR<IProd[]>(
    query ? `${process.env.NEXT_PUBLIC_PRODUCT_API}${query}` : process.env.NEXT_PUBLIC_PRODUCT_API,
    fetcher
  );

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(searchItem);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  };

  if (error)
    return
  <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
    <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'red' }}></i>
    <p className='mt-3'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
    <a className='btn btn-outline-dark mt-3' href='/' onClick={() => window.location.reload()}>Tải lại trang</a>
  </div>;

  if (!products)
    return
  <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className='mt-3'>Đang tải, vui lòng chờ...</p>
  </div>;

  return (
    <>
      <Container className="home">
        <Row className="text-center mb-3 poster-img">
          <Col className="text-white py-5">
            <h1 className="fw-light">IPHONE 15</h1>
            <p className="lead">
              <b>A16 Bionic</b> tăng cường sức mạnh cho các tính năng tiên tiến.
              <b>Cùng thiết kế mới đầy sáng tạo</b> sử dụng mặt lưng kính được pha màu xuyên suốt toàn bộ chất liệu.
            </p>
            <Link href="/product/664414152fa611fcdab42ab0" passHref>
              <Button variant="secondary" className="my-2">Mua ngay</Button>
            </Link>
          </Col>
        </Row>
        <Row className="search-bar mt-5 justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Nhập tên sản phẩm"
                  aria-label="Search"
                  value={searchItem}
                  onChange={handleInputChange}
                />
                <Button variant="outline-success" type="submit">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Row className="product-list mt-5">
          {products.map((product) => (
            <Col md={6} lg={4} xl={3} key={product._id} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={product.imageUrl} />
                <Card.Body className="d-flex flex-column">
                  <div className="p-2">
                    <Card.Title className="text-truncate" style={{ maxWidth: '100%' }}>{product.name}</Card.Title>
                    <Card.Text className="text-truncate" style={{ height: '5rem' }}>{product.description}</Card.Text>
                  </div>
                  <div className="p-2 mt-auto">
                    <div className="d-flex justify-content-between">
                      <Link href={`/product/${product._id}`} passHref>
                        <Button variant="outline-dark">Chi tiết</Button>
                      </Link>
                      {product.status === "0" || product.quantity === 0 ? (
                        <Button variant="outline-dark" disabled>Hết hàng</Button>
                      ) : (
                        <Button variant="dark" className="text-nowrap">{FormatNumber(product.price)} đ</Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;