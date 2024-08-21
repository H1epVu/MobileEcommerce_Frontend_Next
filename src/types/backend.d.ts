interface IProd {
    _id: string,
    name: string,
    price: number,
    imageUrl: string,
    description: string,
    status: string,
    quantity: number
}

interface IComment {
    _id: string;
    userId: string;
    prodId: string;
    email: string;
    content: string;
    createdAt: string;
    replies: Reply[];
}

interface IReply {
    _id: string;
    userId: string;
    email: string;
    content: string;
    createdAt: string;
}

interface IUser {
    _id: string;
    phone: number;
    email: string;
    address: string;
    password: string;
    role: string;
    resetToken: string
}

interface ILoginResponse {
    token: string;
    user: IUser | null;
}

interface IOrder {
    _id: string;
    userId: string;
    userName: string;
    userPhone: string;
    order_items: any[];
    total: number;
    address: string;
    paymentMethod: string;
    status: string;
    orderDate: string;
    __v: number;
}

interface RootState {
    shoppingCart: {
        cartItems: {
            id: number;
            name: string;
            price: number;
            quantity: number;
        }[];
    };
}