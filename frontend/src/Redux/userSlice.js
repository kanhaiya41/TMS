import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        theme: 'light'
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    }
});

export const { setUser, setTheme } = userSlice.actions;
export default userSlice.reducer;