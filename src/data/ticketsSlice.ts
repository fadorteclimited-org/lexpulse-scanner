import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import Cookies from "js-cookie";
import {CombinedTicket} from "./types.ts";
import {AuthState} from "./authSlice.ts";
import {common} from "./utils.ts";

const baseUrl = common.baseUrl;

export const getConfig = () => {
    const token = Cookies.get('token');
    console.log(baseUrl)
    return {
        headers: {
            authorization: `Bearer ${token}`
        },
    };
};

export const fetchTicket = createAsyncThunk('tickets/getTicket', async (id: string, {rejectWithValue}) => {


    try {
        const response = await axios.get(`${baseUrl}/api/v1/scanners/view/${id}`, getConfig())

        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            rejectWithValue(error.message)
        }
    }
})

export const scanTicket = createAsyncThunk('tickets/scanTicket', async (id: string, {rejectWithValue, getState}) => {

    try {
        const {auth} = getState() as {auth: AuthState}
        const response = await axios.post(`${baseUrl}/api/v1/scanners/scan`, {
            ticketId: id,
            scannerId: auth.user?._id
        }, getConfig(),)

        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            rejectWithValue(error.message)
        }
    }
})

interface InitialState {
    tickets: CombinedTicket[];
    scannedTickets: CombinedTicket[];
    currentTicket?: CombinedTicket;
    loading: boolean;
    error: boolean;
    errorMessage?: string;
}

const initialState: InitialState = {
    tickets: [],
    scannedTickets: [],
    currentTicket: undefined,
    loading: false,
    error: false,
    errorMessage: undefined,
}

const ticketsSlice = createSlice({
    name: "tickets", initialState: initialState,

    reducers: {},
    extraReducers: builder => builder.addCase(fetchTicket.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = '';
    }).addCase(fetchTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload
        state.tickets = [...state.tickets, action.payload]
    }).addCase(fetchTicket.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload as string;
    }).addCase(scanTicket.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = '';
    }).addCase(scanTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload
        state.scannedTickets = [...state.scannedTickets, action.payload]
    }).addCase(scanTicket.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload as string;
    })
})

export default ticketsSlice.reducer;