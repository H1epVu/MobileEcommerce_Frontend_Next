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