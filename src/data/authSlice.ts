import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { common } from "./utils.ts";
import {EventModel, Scanner} from "./types.ts";
import { RootState } from "../store.ts";
import { redirect } from "react-router-dom";

export interface AuthState {
    user: Scanner | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    event: EventModel | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    event: null
};

// Utility functions for managing cookies
const setAuthCookies = (token: string, user: Scanner) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
};

export const clearAuthCookies = () => {
    Cookies.remove("token");
    Cookies.remove("user");
};

// Thunk for processing the invite link
export const processInvite = createAsyncThunk(
    "auth/processInvite",
    async (inviteId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${common.baseUrl}/api/v1/scanners/invite/${inviteId}`);
            console.log(response.data.data.scanner);
            return response.data.data.scanner;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue("Failed to process invite");
            }
        }
    }
);

// Thunk for activating the scanner
export const activateScanner = createAsyncThunk(
    "auth/activateScanner",
    async ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${common.baseUrl}/api/v1/scanners/activate`, {
                email,
                password,
                confirmPassword,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue("Failed to activate scanner");
            }
        }
    }
);

export const loginScanner = createAsyncThunk(
    'auth/loginScanner',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const raw = JSON.stringify({ email, password });
            const config = { headers: { 'Content-Type': 'application/json' } };

            const res = await axios.post(`${common.baseUrl}/api/v1/scanners/login`, raw, config);

            if (res.status === 200) {
                const { token, user, event } = res.data;
                setAuthCookies(token, user); // Save token & user in cookies
                return { success: true, token, user, event };
            } else {
                return rejectWithValue(res.data.msg);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.msg);
            } else {
                return rejectWithValue('Failed to login');
            }
        }
    }
);


// Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            clearAuthCookies();
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            state.event = null;
            redirect("/login");
        },
    },
    extraReducers: (builder) => builder
        // Handle invite processing
       .addCase(processInvite.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(processInvite.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        }).addCase(processInvite.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Handle scanner activation
       .addCase(activateScanner.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(activateScanner.fulfilled, (state) => {
            state.loading = false;
            // Possibly redirect or store success
        })
            .addCase(activateScanner.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
            // Login Scanner
            .addCase(loginScanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginScanner.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.event = action.payload.event;
            })
            .addCase(loginScanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            }),
});

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const { logout } = authSlice.actions;
export default authSlice.reducer;