const PaymentCancel = () => {
    return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
                <i className="bi bi-bag-x" style={{ fontSize: '3rem' }}></i>
                <p className='mt-3'>Thanh toán đã bị hủy.</p>
                <a className='btn btn-outline-dark' href='/'>Tiếp tục mua sắm</a>
            </div>
        </>
    );
};

export default PaymentCancel;