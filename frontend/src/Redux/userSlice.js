import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        theme: 'light',
        notificationCount: 0
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setNotificationCount: (state, action) => {
            state.notificationCount = action.payload;
        }
    }
});

export const { setUser, setTheme, setNotificationCount } = userSlice.actions;
export default userSlice.reducer;