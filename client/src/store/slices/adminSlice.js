import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/admin/users', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const approveInstructor = createAsyncThunk(
  'admin/approveInstructor',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/approve`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve');
    }
  }
);

export const fetchPlatformAnalytics = createAsyncThunk(
  'admin/analytics',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/admin/analytics');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(approveInstructor.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload.user._id);
        if (idx !== -1) state.users[idx] = action.payload.user;
      })
      .addCase(fetchPlatformAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
        state.loading = false;
      });
  },
});

export default adminSlice.reducer;
