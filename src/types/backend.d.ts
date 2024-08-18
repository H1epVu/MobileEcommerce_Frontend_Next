interface IProd {
    _id: string,
    name: string,
    price: number,
    imageUrl: string,
    description: string,
    status: string,
    quantity: number
}

interface Comment {
    _id: string;
    userId: string;
    prodId: string;
    email: string;
    content: string;
    createdAt: string;
    replies: Reply[];
}

interface Reply {
    _id: string;
    userId: string;
    email: string;
    content: string;
    createdAt: string;
}