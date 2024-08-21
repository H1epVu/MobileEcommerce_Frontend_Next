'use client';

import React from 'react';
import useSWR from 'swr';
import { FormatNumber } from '@/utils';

const fetcher = (url: string) => fetch(url, {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}).then(res => res.json());

const HomeAdminClient = () => {
    const { data: orders } = useSWR(`${process.env.NEXT_PUBLIC_ORDER_API}`, fetcher);
    const { data: products } = useSWR(`${process.env.NEXT_PUBLIC_PRODUCT_API}`, fetcher);
    const { data: users } = useSWR(`${process.env.NEXT_PUBLIC_USER_API}`, fetcher);
    const { data: openOrders } = useSWR(`${process.env.NEXT_PUBLIC_ORDER_API}status?status=open`, fetcher);
    const { data } = useSWR(`${process.env.NEXT_PUBLIC_ORDER_API}totalRevenue`, fetcher);
    const { data: dayOrders } = useSWR(`${process.env.NEXT_PUBLIC_ORDER_API}ordersByDate`, fetcher);

    const totalOrders = orders ? orders.length : 0;
    const totalProds = products ? products.length : 0;
    const totalUsers = users ? users.length - 1 : 0;
    const openOrdersCount = openOrders ? openOrders.length : 0;
    const weekTotal = data ? data.weekTotal || '0' : '0';
    const monthTotal = data ? data.monthTotal || '0' : '0';
    const dayOrdersCount = dayOrders ? dayOrders.length : 0;

    const total = orders ? orders.reduce((sum: number, item: any) => {
        if (item.status === "closed") {
            return sum + item.total;
        }
        return sum;
    }, 0) : 0;

    return (
        <div className="container">
            <div className='text-center my-5'>
                <h1><strong>DASHBOARD</strong></h1>
            </div>
            <div className="row">
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><strong>Tổng doanh thu</strong></h5>
                            <p className="card-text">{FormatNumber(total)} đ</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><strong>Tổng sản phẩm</strong></h5>
                            <p className="card-text">{totalProds} sản phẩm</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><strong>Tổng đơn hàng</strong></h5>
                            <p className="card-text">{totalOrders} đơn hàng</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><strong>Tổng người dùng</strong></h5>
                            <p className="card-text">{totalUsers} người</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5><strong>Doanh thu</strong></h5>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Doanh thu theo tuần</h5>
                            <p className="card-text">{FormatNumber(weekTotal)} đ</p>
                            <h5 className="card-title">Doanh thu theo tháng</h5>
                            <p className="card-text">{FormatNumber(monthTotal)} đ</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5><strong>Đơn hàng</strong></h5>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Đơn hàng chưa xử lý</h5>
                            <p className="card-text">{openOrdersCount} đơn hàng</p>
                            <h5 className="card-title">Đơn hàng mới theo ngày</h5>
                            <p className="card-text">{dayOrdersCount} đơn hàng mới</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeAdminClient;