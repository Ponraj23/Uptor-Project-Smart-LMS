import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchCourseQuizzes = createAsyncThunk(
  'quizzes/fetchForCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/quizzes/course/${courseId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  'quizzes/fetchOne',
  async (quizId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/quizzes/${quizId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const generateAIQuiz = createAsyncThunk(
  'quizzes/generateAI',
  async (quizData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/quizzes/generate', quizData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quizzes/submit',
  async ({ quizId, answers, timeTaken }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/quizzes/${quizId}/submit`, { answers, timeTaken });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

export const fetchMyAttempts = createAsyncThunk(
  'quizzes/myAttempts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/quizzes/attempts/my');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attempts');
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    quizResult: null,
    attempts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearQuizResult: (state) => { state.quizResult = null; },
    clearQuizError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload.quizzes;
        state.loading = false;
      })
      .addCase(fetchQuiz.pending, (state) => { state.loading = true; })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.currentQuiz = action.payload.quiz;
        state.loading = false;
      })
      .addCase(generateAIQuiz.pending, (state) => { state.loading = true; })
      .addCase(generateAIQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload.quiz);
        state.loading = false;
      })
      .addCase(generateAIQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => { state.loading = true; })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.quizResult = action.payload.results;
        state.loading = false;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload.attempts;
      });
  },
});

export const { clearQuizResult, clearQuizError } = quizSlice.actions;
export default quizSlice.reducer;
