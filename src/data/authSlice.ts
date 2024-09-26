import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';

import {common} from "./utils.ts";

import {Scanner} from "./types.ts";
import {redirect} from "react-router-dom";
import {RootState} from "../store.ts";


export interface AuthState {
    user: Scanner | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

// Utility functions for managing cookies
const setAuthCookies = (token: string, user: Scanner) => {
    // Store cookies that expire in 7 days
    Cookies.set('token', token, {expires: 7});
    Cookies.set('user', JSON.stringify(user), {expires: 7});
};

export const clearAuthCookies = () => {
    Cookies.remove('token');
    Cookies.remove('user');
};

// Thunk for signing in
export const signInHost = createAsyncThunk(
    'auth/signIn',
    async ({email, password}:{ email: string; password: string }, {rejectWithValue}) => {
        try {
            const raw = JSON.stringify({email, password});
            const config = {headers: {'Content-Type': 'application/json'}};

            const res = await axios.post(`${common.baseUrl}/api/v1/auth`, raw, config);

            if (res.status === 200) {
                const {token, user} = res.data;
                setAuthCookies(token, user); // Store in cookies
                return {success: true, status: res.status, data: {token, user}};
            } else {
                return rejectWithValue({success: false, status: res.status, message: res.data.msg});
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    clearAuthCookies();
                    redirect('/login'); // Vite.js navigation
                }
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to sign in');
            }
        }
    }
);



// Thunk for getting the user data
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (id:string, {rejectWithValue}) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                redirect('/login');
                ;
                return rejectWithValue('Unauthorized');
            }

            const config = {headers: {Authorization: `Bearer ${token}`}};

            const res = await axios.get(`${common.baseUrl}/api/v1/users/${id}`, config);
            if (res.status === 200) {
                return res.data.data.user;

            } else {
                return rejectWithValue(res.data.msg);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    clearAuthCookies();
                    redirect('/login');
                }
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to fetch user');
            }
        }
    }
);

// Thunk for updating the user
export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({id, data}:{ id: string; data: Partial<Scanner> }, {rejectWithValue}) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                redirect('/login');
                ;
                return rejectWithValue('Unauthorized');
            }

            const config = {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}};

            const res = await axios.put(`${common.baseUrl}/api/v1/users/${id}`, data, config);
            if (res.status === 200) {
                return res.data.data.user;
            } else {
                return rejectWithValue(res.data.msg);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    clearAuthCookies();
                    redirect('/login');
                }
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to update user');
            }
        }
    }
);

// Thunk for resetting the password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({email}:{ email: string }, {rejectWithValue}) => {
        try {
            const raw = JSON.stringify({email});
            const config = {headers: {'Content-Type': 'application/json'}};

            const res = await axios.post(`${common.baseUrl}/api/v1/auth/reset-password`, raw, config);

            if (res.status === 200) {
                return res.data;
            } else {
                return rejectWithValue({success: false, status: res.status, message: res.data.msg});
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    clearAuthCookies();
                    redirect('/login'); // Vite.js navigation
                }
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to reset password');
            }
        }
    }
);

// Thunk for changing the password
export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async ({email, password, confirmPassword}:{email: string; password: string; confirmPassword: string }, {rejectWithValue}) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                redirect('/login');
                return rejectWithValue('Unauthorized');
            }

            const raw = JSON.stringify({email: email, password: password, confirmPassword: confirmPassword});
            const config = {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}};

            const res = await axios.post(`${common.baseUrl}/api/v1/auth/change-password`, raw, config);

            if (res.status === 200) {
                return res.data;
            } else {
                return rejectWithValue({success: false, status: res.status, message: res.data.msg});
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    clearAuthCookies();
                    redirect('/login');
                }
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to change password');
            }
        }
    }
);

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            clearAuthCookies();
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            redirect('/login');
        },
        checkUser(state) {
            const user = Cookies.get('user');
            const token = Cookies.get('token');
            if (user && token) {
                state.user = JSON.parse(user);
                state.token = token;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Sign In
            .addCase(signInHost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInHost.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.token;
                state.user = action.payload.data.user;
            })
            .addCase(signInHost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const {logout, checkUser} = authSlice.actions;

export default authSlice.reducer;