import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import jwt_decode from "jsonwebtoken";
import React from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchUser } from '../../redux/User/user-slice';
import { fetchRecipes, changePage, loadPage } from '../../redux/Recipes/recipes-slice';
import { fetchInteractions } from '../../redux/Interactions/interactions-slice';

const LoadingAccount = () => {
    // redux state
    const savoryUser = useSelector((state: RootState) => state.persistedReducer.userReducer);
    // auth0 state
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // loading resources
    const [status, setStatus] = useState('Loading...');
    async function loadProfile() {
        setStatus('Loading Profile...');
        await loadUser();
        setStatus('Loading Recipes...');
    }
    async function loadFeed() {
        await loadRecipes();
        setStatus('Loading Interactions...');
        await loadInteractions();
        setStatus('Loading Complete...');
    }
    // loading functions
    async function loadUser() {
        const email = (user ? user?.email : '') as string;
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-t6vspuc8qrssaarc.us.auth0.com/api/v2/',
                    scope: "email",
                },
                cacheMode: 'off',
            }) || '';
            
            Cookies.set('jwtToken', token, {
                htppOnly: true,
                expires: 1,
                path: '/',
                secure: true,
                sameSite: 'strict',
            });
            await dispatch(fetchUser({ email, isAuthenticated, token }));
        } catch(error){console.error("Error Fetching User: ", error)}
    }
    async function loadRecipes() {
        const userId = savoryUser?.user?.id || -1;
        dispatch(changePage({pageNumber: 1}));
        dispatch(loadPage({loaded: true}))
        const pageNumber = 1;
        try {
            await dispatch(fetchRecipes({userId, pageNumber}));
        } catch(error){console.error("Error Fetching Recipes: ", error)}
    }
    async function loadInteractions() {
        const userId = savoryUser?.user?.id || -1;
        try {
            await dispatch(fetchInteractions({userId}));
        } catch(error){console.error("Error Fetching Interactions: ", error)}
    }
    // effect
    useEffect(() => {
        if(!isAuthenticated || !user || status != 'Loading...') return;
        loadProfile();
    }, [isAuthenticated, user, status]);
    useEffect(() => {
        if(!savoryUser || !savoryUser.user || status != 'Loading Recipes...') return;
        loadFeed();
    }, [savoryUser, status]);
    useEffect(() => {
        if(status != 'Loading Complete...') return;
        const page = savoryUser.user?.username ? '/feed' : '/profile/edit'
        navigate(`${page}`);
    },[status]);
    // display
    return(
      <Box>
        <Typography variant='h2' mt='10vh'>Welcome</Typography>
        <Typography mb='10vh'>{status}</Typography>
        <CircularProgress />
      </Box>
    );
};
  
export default LoadingAccount;