import { createSlice } from '@reduxjs/toolkit';

const initialCartState = {
    cartVisible: false,
    shoppingData: !!localStorage.getItem('shoppingData') ? JSON.parse(localStorage.getItem('shoppingData')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        toggleCartVisibility: state => {
            state.cartVisible = !state.cartVisible;
        },
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.shoppingData.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.amount += 1;
            } else {
                state.shoppingData.push({ ...newItem, amount: 1 });
            }
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
        },
        removeItem: (state, action) => {
            const id = action.payload;
            const itemIndex = state.shoppingData.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                if (state.shoppingData[itemIndex].amount > 1) {
                    state.shoppingData[itemIndex].amount -= 1; // If quantity is greater than 1, decrement it
                } else {
                    state.shoppingData.splice(itemIndex, 1); // If quantity is 1, remove the item entirely
                }
            }
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
        },
        clearItems: state => {
            state.shoppingData = [];
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
        },
        updateItemAmount: (state, action) => {
            const { id, amount } = action.payload;
            const itemToUpdate = state.shoppingData.find(item => item.id === id);
            if (itemToUpdate) {
                itemToUpdate.amount = amount;
                // Save to local storage
                localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
            }
        }
    }
});

export const { toggleCartVisibility, addItem, removeItem, clearItems, updateItemAmount } = cartSlice.actions;
export const selectCartVisibility = state => state.cart.cartVisible;
export const selectShoppingData = state => state.cart.shoppingData;

export default cartSlice.reducer;
