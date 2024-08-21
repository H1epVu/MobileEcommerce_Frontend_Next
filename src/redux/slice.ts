import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const item = state.items.find(i => i._id === action.payload._id);
            if (item) {
                item.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.total += action.payload.price * action.payload.quantity;
        },
        removeItem: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i._id === action.payload);
            if (item) {
                state.total -= item.price * item.quantity;
                state.items = state.items.filter(i => i._id !== action.payload);
            }
        },
        updateQuantity: (state, action: PayloadAction<{ _id: string, quantity: number }>) => {
            const item = state.items.find(i => i._id === action.payload._id);
            if (item) {
                state.total += (action.payload.quantity - item.quantity) * item.price;
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;