import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import quizReducer from './slices/quizSlice';
import progressReducer from './slices/progressSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    quizzes: quizReducer,
    progress: progressReducer,
    admin: adminReducer,
  },
});
