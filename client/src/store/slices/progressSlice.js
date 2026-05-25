import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchMyProgress = createAsyncThunk(
  'progress/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/progress/my');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
    }
  }
);

export const completeLesson = createAsyncThunk(
  'progress/completeLesson',
  async (lessonData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/progress/lesson-complete', lessonData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'progress/recommendations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/progress/recommendations');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchPerformanceAnalysis = createAsyncThunk(
  'progress/analysis',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/progress/analysis');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analysis');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    progressRecords: [],
    recommendations: [],
    analysis: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.progressRecords = action.payload.progress;
        state.loading = false;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        const idx = state.progressRecords.findIndex(
          (p) => p.course === action.payload.progress.course || p.course?._id === action.payload.progress.course
        );
        if (idx !== -1) state.progressRecords[idx] = action.payload.progress;
      })
      .addCase(fetchRecommendations.pending, (state) => { state.loading = true; })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations;
        state.loading = false;
      })
      .addCase(fetchPerformanceAnalysis.pending, (state) => { state.loading = true; })
      .addCase(fetchPerformanceAnalysis.fulfilled, (state, action) => {
        state.analysis = action.payload;
        state.loading = false;
      });
  },
});

export default progressSlice.reducer;
