import React, { ReactNode, createContext, useReducer } from 'react';

interface State {
    selectedIngredients: string[];
}

interface Action {
    type: string;
    payload?: string;
}

interface ProviderProps {
    children: ReactNode;
}

const initialState: State = {
    selectedIngredients: [],
};

const globalReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'TOGGLE_INGREDIENT':
            if (action.payload) {
                if (state.selectedIngredients.includes(action.payload)) {
                    return {
                        ...state,
                        selectedIngredients: state.selectedIngredients.filter(
                            (ingredient) => ingredient !== action.payload
                        ),
                    };
                } else {
                    return {
                        ...state,
                        selectedIngredients: [...state.selectedIngredients, action.payload],
                    };
                }
            }
            return state; // If action.payload is undefined, return the current state
        case 'CLEAR_ALL':
            return {
                ...state,
                selectedIngredients: [],
            };
        default:
            return state;
    }
};

export const GlobalContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const GlobalProvider: React.FC<ProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initialState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};