import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuth } from 'models/auth';
import SignIn from 'pages/login/login';
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();


export type TypeInitialStateAuth = {
    user?: IAuth | null,
    validatorError?: Array<string>,
    error?: string,
    message?: string,
    isAuthenticated?: boolean,
    isLoading?: boolean,
    permissions?: Array<string>,
    refreshLoading: boolean
}

const initialState: TypeInitialStateAuth = {
    user: null,
    validatorError: [],
    error: '',
    message: '',
    isAuthenticated: false,
    isLoading: false,
    permissions: [],
    refreshLoading: true,
}


const SignInSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.message = '';
            state.error = '';
            state.validatorError = [];
            state.permissions = [];
            state.user = null;
            localStorage.removeItem('access_token');
            queryClient.clear();
        },
        loadingAuth(state, action) {
            state.refreshLoading = false;
        },
        updatedPassword(state) {
            if (state.user) {
                state.user.is_changed = 1
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(SignIn.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true
            })
            .addCase(SignIn.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload && action?.payload?.status === 1) {
                    state.user = action.payload.data
                    state.message = action.payload.message
                    state.isLoading = false
                    state.isAuthenticated = true
                    state.permissions = action.payload?.data?.permissions
                } else {
                    state.isLoading = false
                    state.isAuthenticated = false
                }
            })
            .addCase(SignIn.rejected, (state, action: PayloadAction<any>) => {
                if (action?.payload?.data?.status === 0) {
                    state.validatorError = action.payload?.data?.errors
                    state.error = action.payload.data?.message
                    state.isLoading = false
                } else {
                    state.validatorError = ['Something went wrong !!!']
                    state.error = 'disconnect'
                    state.isLoading = false
                }
            })
    }
})


export const { logout, loadingAuth, updatedPassword } = SignInSlice.actions;

export default SignInSlice.reducer;


