import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postLogin, logoutUser } from "services/apiRequestsUser"; // Import your API functions
import { getToken, setToken } from "utils/cookies"; // Import cookie functions


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password, recaptcha }, { rejectWithValue }) => {
    try {
      const response = await postLogin(username, password, recaptcha);
      if (response.status === 200) {
        const { token, expiry } = response.data;
        setToken(token, expiry);
        return { token, expiry, user: response.data.user };
      } else {
        return rejectWithValue("Unexpected response status");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code out of the 2xx range
        console.error("Error Response:", error.response);
        return rejectWithValue(error.response.data || "Server Error");
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No Response Received:", error.request);
        return rejectWithValue("No response from server");
      } else {
        // Other errors (setting up request, etc.)
        console.error("Error during request setup:", error.message);
        return rejectWithValue("Request setup error");
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser(); 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "Network Error");
    }
  }
);

const initialState = {
  isLoggedIn: Boolean(getToken()),
  user: null,
  token: getToken() || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user; 
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
