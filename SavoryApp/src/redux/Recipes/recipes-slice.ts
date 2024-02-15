import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Recipe {
    id: string,
    ownerId: number,
    title: string;
    img: string;
}
interface LocalRecipesState {
    recipes: Recipe[],
    loading: boolean,
    error?: string,
}

const initialState: LocalRecipesState = {
    recipes: [],
    loading: false,
};

const recipesSlice = createSlice({
    name: 'recipes-slice',
    initialState,
    reducers: {
        addRecipes(state: LocalRecipesState, action: PayloadAction<{recipe: Recipe}>) {
            state.recipes.push(action.payload.recipe);
        },
        updateRecipes(state: LocalRecipesState, action: PayloadAction<{recipe: Recipe}>) {
            const update = action.payload.recipe;
            const index = state.recipes.findIndex(recipe => recipe.id === update.id);
            if (index !== -1) state.recipes[index] = update;
        },
        deleteRecipes(state: LocalRecipesState, action: PayloadAction<{recipeId: string}>) {
            state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload.recipeId);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchRecipes.pending, (state: LocalRecipesState) => {
                state.loading = true;
                console.log('Recipe Fetch Started...');
            }
        ).addCase(
            fetchRecipes.fulfilled, (state: LocalRecipesState, action: PayloadAction<Recipe[]>) => {
                state.recipes = action.payload;
                state.loading = false;
                console.log('Recipe Fetch Successful...');
            }
        ).addCase(
            fetchRecipes.rejected, (state: LocalRecipesState, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log('Recipe Fetch Failed...');
            }
        );
    },
});

export const fetchRecipes = createAsyncThunk(
    '/api/recipes/fetch',
    async () => {
        const response = await fetch(`http://localhost:8080/posts`, {method: 'GET'});
        const data = await response.json();
        const recipes: Recipe[] = data.map((item: any) => ({
            id: item.post_id,
            ownerId: item.userID,
            title: item.headline,
            img: '',
        }));
        return recipes;
    },
);

export const { addRecipes, updateRecipes, deleteRecipes } = recipesSlice.actions;
export default recipesSlice.reducer;