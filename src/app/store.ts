import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/projects/projectSlice';

export const store = configureStore({
    reducer: {
        projects: projectReducer,
        // Add other reducers here as we create them
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;