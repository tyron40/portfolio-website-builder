import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Portfolio } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface PortfoliosState {
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfoliosState = {
  portfolios: [],
  loading: false,
  error: null,
};

export const fetchPortfolios = createAsyncThunk(
  'portfolios/fetchPortfolios',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { isGuest: boolean } };
      const isGuest = state.auth.isGuest;
      
      // For guest users, return from local storage or create a default portfolio
      if (isGuest) {
        const storedPortfolios = localStorage.getItem('guestPortfolios');
        if (storedPortfolios) {
          return JSON.parse(storedPortfolios) as Portfolio[];
        }
        
        // Create a default portfolio for guest users
        const defaultPortfolio: Portfolio = {
          id: uuidv4(),
          userId,
          name: 'My Portfolio',
          description: 'My professional portfolio website',
          theme: 'blue',
          pages: [
            {
              id: uuidv4(),
              name: 'Home',
              slug: 'home',
              sections: [
                {
                  id: uuidv4(),
                  name: 'Hero Section',
                  components: [],
                },
                {
                  id: uuidv4(),
                  name: 'About Section',
                  components: [],
                },
                {
                  id: uuidv4(),
                  name: 'Projects Section',
                  components: [],
                },
              ],
            },
          ],
          published: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const portfolios = [defaultPortfolio];
        localStorage.setItem('guestPortfolios', JSON.stringify(portfolios));
        return portfolios;
      }
      
      // For registered users, fetch from Firebase
      const portfoliosRef = collection(db, 'portfolios');
      const q = query(portfoliosRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const portfolios: Portfolio[] = [];
      querySnapshot.forEach((doc) => {
        portfolios.push({ id: doc.id, ...doc.data() } as Portfolio);
      });
      
      return portfolios;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'portfolios/fetchPortfolio',
  async (portfolioId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { isGuest: boolean } };
      const isGuest = state.auth.isGuest;
      
      // For guest users, get from local storage
      if (isGuest) {
        const storedPortfolios = localStorage.getItem('guestPortfolios');
        if (storedPortfolios) {
          const portfolios = JSON.parse(storedPortfolios) as Portfolio[];
          const portfolio = portfolios.find(p => p.id === portfolioId);
          if (portfolio) {
            return portfolio;
          }
        }
        return rejectWithValue('Portfolio not found');
      }
      
      // For registered users, fetch from Firebase
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      const portfolioSnap = await getDoc(portfolioRef);
      
      if (portfolioSnap.exists()) {
        return { id: portfolioSnap.id, ...portfolioSnap.data() } as Portfolio;
      } else {
        return rejectWithValue('Portfolio not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPortfolio = createAsyncThunk(
  'portfolios/createPortfolio',
  async ({ userId, name, description, theme }: { userId: string; name: string; description?: string; theme: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { isGuest: boolean } };
      const isGuest = state.auth.isGuest;
      
      const newPortfolio: Omit<Portfolio, 'id'> = {
        userId,
        name,
        description,
        theme,
        pages: [
          {
            id: uuidv4(),
            name: 'Home',
            slug: 'home',
            sections: [
              {
                id: uuidv4(),
                name: 'Hero Section',
                components: [],
              },
              {
                id: uuidv4(),
                name: 'About Section',
                components: [],
              },
              {
                id: uuidv4(),
                name: 'Projects Section',
                components: [],
              },
            ],
          },
        ],
        published: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // For guest users, save to local storage
      if (isGuest) {
        const portfolioWithId = { ...newPortfolio, id: uuidv4() };
        
        const storedPortfolios = localStorage.getItem('guestPortfolios');
        let portfolios: Portfolio[] = [];
        
        if (storedPortfolios) {
          portfolios = JSON.parse(storedPortfolios);
        }
        
        portfolios.push(portfolioWithId);
        localStorage.setItem('guestPortfolios', JSON.stringify(portfolios));
        
        return portfolioWithId;
      }
      
      // For registered users, save to Firebase
      const docRef = await addDoc(collection(db, 'portfolios'), newPortfolio);
      return { id: docRef.id, ...newPortfolio };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  'portfolios/updatePortfolio',
  async (portfolio: Portfolio, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { isGuest: boolean } };
      const isGuest = state.auth.isGuest;
      
      // For guest users, update in local storage
      if (isGuest) {
        const storedPortfolios = localStorage.getItem('guestPortfolios');
        if (storedPortfolios) {
          let portfolios = JSON.parse(storedPortfolios) as Portfolio[];
          const index = portfolios.findIndex(p => p.id === portfolio.id);
          
          if (index !== -1) {
            portfolios[index] = {
              ...portfolio,
              updatedAt: Date.now(),
            };
            
            localStorage.setItem('guestPortfolios', JSON.stringify(portfolios));
            return portfolios[index];
          }
        }
        return portfolio;
      }
      
      // For registered users, update in Firebase
      const { id, ...portfolioData } = portfolio;
      const portfolioRef = doc(db, 'portfolios', id);
      
      await updateDoc(portfolioRef, {
        ...portfolioData,
        updatedAt: Date.now(),
      });
      
      return portfolio;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolios/deletePortfolio',
  async (portfolioId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { isGuest: boolean } };
      const isGuest = state.auth.isGuest;
      
      // For guest users, delete from local storage
      if (isGuest) {
        const storedPortfolios = localStorage.getItem('guestPortfolios');
        if (storedPortfolios) {
          let portfolios = JSON.parse(storedPortfolios) as Portfolio[];
          portfolios = portfolios.filter(p => p.id !== portfolioId);
          localStorage.setItem('guestPortfolios', JSON.stringify(portfolios));
        }
        return portfolioId;
      }
      
      // For registered users, delete from Firebase
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      await deleteDoc(portfolioRef);
      return portfolioId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const portfoliosSlice = createSlice({
  name: 'portfolios',
  initialState,
  reducers: {
    clearPortfolios: (state) => {
      state.portfolios = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.portfolios.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.portfolios[index] = action.payload;
        } else {
          state.portfolios.push(action.payload);
        }
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios.push(action.payload);
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.portfolios.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.portfolios[index] = action.payload;
        }
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.filter(p => p.id !== action.payload);
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPortfolios } = portfoliosSlice.actions;
export default portfoliosSlice.reducer;