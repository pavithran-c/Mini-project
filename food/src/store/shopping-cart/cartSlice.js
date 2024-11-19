import { createSlice } from "@reduxjs/toolkit";

// Retrieve data from localStorage if exists
const getStoredData = (key, defaultValue) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

const items = getStoredData("cartItems", []);
const totalAmount = getStoredData("totalAmount", 0);
const totalQuantity = getStoredData("totalQuantity", 0);

// Function to save cart data to localStorage
const setItemFunc = (cartItems, totalAmount, totalQuantity) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
  cartItems: items,
  totalQuantity: totalQuantity,
  totalAmount: totalAmount,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.cartItems.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
        state.totalQuantity++;
      } else {
        const ingredientMatch = JSON.stringify(existingItem.extraIngredients) === JSON.stringify(newItem.extraIngredients);
        if (ingredientMatch) {
          existingItem.quantity++;
        } else {
          // Update cart item with new extra ingredients
          const index = state.cartItems.findIndex(item => item.id === existingItem.id);
          state.cartItems[index] = {
            ...existingItem,
            extraIngredients: newItem.extraIngredients,
            quantity: 1,
            totalPrice: existingItem.price,
          };
        }
      }

      // Recalculate total quantity and amount
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      // Save to localStorage
      setItemFunc(state.cartItems, state.totalAmount, state.totalQuantity);
    },

    // ========= remove item ========
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save to localStorage
      setItemFunc(state.cartItems, state.totalAmount, state.totalQuantity);
    },

    //============ delete item ===========
    deleteItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save to localStorage
      setItemFunc(state.cartItems, state.totalAmount, state.totalQuantity);
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
