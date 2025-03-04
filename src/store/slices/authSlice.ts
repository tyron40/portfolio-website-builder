import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { User } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isGuest: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      return {
        id: userCredential.user.uid,
        name: name,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || '',
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginAsGuest = createAsyncThunk(
  'auth/loginAsGuest',
  async () => {
    // Generate a random guest user
    const guestId = `guest-${uuidv4()}`;
    
    return {
      id: guestId,
      name: 'Guest User',
      email: `${guestId}@example.com`,
      isGuest: true,
    };
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      
      // Only sign out from Firebase if not a guest user
      if (!state.auth.isGuest) {
        await firebaseSignOut(auth);
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isGuest = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isGuest = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isGuest = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginAsGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isGuest = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isGuest = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;