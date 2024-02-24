import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login,register } from './loginAPI';
import { refreshToken as refresh } from './loginAPI';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const initialState = {
  isLoggedIn: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  regError: null,
  isRegistered: false,
  username: !!localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).username : '',
};



export const loginAsync = createAsyncThunk(
  'login',
  async ({ credentials, includeRefreshToken }, thunkAPI) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.access);
      if (includeRefreshToken) {
        localStorage.setItem('refreshToken', response.refresh);
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'login/registerAsync',
  async (credentials, thunkAPI) => {
    try {
      const response = await register(credentials);
      return response;
    } catch (regError) {
      return thunkAPI.rejectWithValue(regError.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'login/refreshAccessToken',
  async (_, thunkAPI) => {
    try {
      const response = await refresh(); // Call the function to refresh the token
      localStorage.setItem('token', response.access); // Update the new access token in localStorage
      toast.success('Token refreshed successfully!');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



export const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  return { type: 'login/logout' };
}



export const checkTokenExpiration = createAsyncThunk(
  'login/checkTokenExpiration',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token

    // If no token or refresh token is found, log out the user
    if (!token) {
      thunkAPI.dispatch(handleLogout());
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if the access token is expired
      if (decodedToken.exp < currentTime) {
        // If no refresh token is available, log out the user
        if (!refreshToken) {
          thunkAPI.dispatch(handleLogout());
          toast.error('Session expired. Please login again.');
        } else {
          // Check if the refresh token is still valid
          const decodedRefreshToken = jwtDecode(refreshToken);
          if (decodedRefreshToken.exp < currentTime) {
            // If both access token and refresh token are expired, log out the user
            thunkAPI.dispatch(handleLogout());
            toast.error('Session expired. Please login again.');
          } else {
            // If only access token is expired but refresh token is still valid, refresh the access token
            await thunkAPI.dispatch(refreshAccessToken());
          }
        }
      }
    } catch (error) {
      thunkAPI.dispatch(handleLogout());
    }
  }
);


export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.logged = true;
        state.isLoading = false;
        state.error = null;
        const decodedToken = jwtDecode(action.payload.access);
        state.username = decodedToken.username;
        toast.success(`Login successful! Welcome ${state.username}!`);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase('login/logout', (state) => {
        state.isLoggedIn = !!localStorage.getItem('token');
      })
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.regError = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isRegistered = true;
        state.isLoading = false;
        state.regError = null;
        toast.success('Registration successful!')
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.regError = action.payload;
        toast.error(action.payload);
      });
  },
});


export const selectIsRegistered = (state) => state.login.isRegistered;
export const selectIsLoggedIn = (state) => state.login.isLoggedIn;
export const selectIsLoading = (state) => state.login.isLoading;
export const selectError = (state) => state.login.error;
export const selectRegError = (state) => state.login.regError;
export const selectUsername = (state) => state.login.username;

export default loginSlice.reducer;
