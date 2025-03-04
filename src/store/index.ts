import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import builderReducer from './slices/builderSlice';
import portfoliosReducer from './slices/portfoliosSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    builder: builderReducer,
    portfolios: portfoliosReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;