import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/courses', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'courses/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/courses', courseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/courses/${id}`, courseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/courses/${courseId}/enroll`);
      return { ...data, courseId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll');
    }
  }
);

export const fetchInstructorCourses = createAsyncThunk(
  'courses/instructorCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/courses/instructor/my-courses');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/enrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/courses/student/enrolled');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    currentCourse: null,
    enrolledCourses: [],
    instructorCourses: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCourseError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourse.pending, (state) => { state.loading = true; })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.instructorCourses.unshift(action.payload.course);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.instructorCourses = action.payload.courses;
        state.loading = false;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload.courses;
        state.loading = false;
      });
  },
});

export const { clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;
