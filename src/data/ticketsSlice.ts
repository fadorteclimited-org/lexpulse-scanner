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

export const fetchTicket = createAsyncThunk('tickets/getTicket', async (id: string, {rejectWithValue, getState}) => {
    const {tickets} = getState() as { tickets: InitialState };

    console.log(tickets);
    // Check if the ticket is already scanned
    const scannedTicket = tickets.scannedTickets.find(ticket => ticket._id === id);
    if (scannedTicket) {
        // Return the scanned ticket if found
        return scannedTicket;
    }

    // Check if the ticket exists in unsorted tickets
    const existingTicket = tickets.tickets.find(ticket => ticket._id === id);
    if (existingTicket) {
        return existingTicket;
    }

    // If not found locally, fetch from the server
    try {
        const response = await axios.get(`${baseUrl}/api/v1/scanners/view/${id}`, getConfig());
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.message);
        }
    }
});

export const scanTicket = createAsyncThunk('tickets/scanTicket', async (id: string, {rejectWithValue, getState}) => {
    const {auth, tickets} = getState() as {auth: AuthState, tickets: InitialState};

    try {
        const ticket = tickets.scannedTickets.find(ticket => ticket._id === id);
        if (ticket) {
            rejectWithValue("Ticket Already Scanned");
        }

        const response = await axios.post(`${baseUrl}/api/v1/scanners/scan`, {
            ticketId: id,
            scannerId: auth.user?._id
        }, getConfig());

        const scannedTicket = response.data.data;

        // Return the scanned ticket
        return scannedTicket;
    } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
            return rejectWithValue(error.message);
        }
    }
});

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
    name: "tickets",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => builder
        // Fetch ticket
        .addCase(fetchTicket.pending, (state) => {
            state.loading = true;
            state.error = false;
            state.errorMessage = '';
        })
        .addCase(fetchTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.currentTicket = action.payload;


            const exists = state.tickets.find(ticket => ticket._id === action.payload._id);
            if (!exists) {
                state.tickets = [...state.tickets, action.payload];
            }
        })
        .addCase(fetchTicket.rejected, (state, action) => {
            state.error = true;
            state.errorMessage = action.payload as string;
        })

        // Scan ticket
        .addCase(scanTicket.pending, (state) => {
            state.loading = true;
            state.error = false;
            state.errorMessage = '';
        })
        .addCase(scanTicket.fulfilled, (state, action) => {
            state.loading = false;
            state.currentTicket = action.payload;


            state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload._id);


            state.scannedTickets = [...state.scannedTickets, action.payload];


        })
        .addCase(scanTicket.rejected, (state, action) => {
            state.error = true;
            state.errorMessage = action.payload as string;
        })
});


export default ticketsSlice.reducer;