import React, { ReactNode, createContext, useReducer } from "react";

export interface Rating {
  rating: number;
}

export interface Comment {
  username: string;
  comment: string;
}

export interface Recipe {
  name: string;
  image: string;
  calories: number;
  cookTime: number;
  ratings: Rating[];
  comments: Comment[];
}

interface State {
  selectedIngredients: string[];
  selectedRecipe: Recipe | null;
}

interface IngredientAction {
  type: "TOGGLE_INGREDIENT" | "CLEAR_ALL";
  payload?: string;
}

interface RemoveIngredientAction {
  type: "REMOVE_INGREDIENT";
  payload: number;
}

interface RecipeAction {
  type: "SELECT_RECIPE";
  payload: Recipe;
}

type Action = IngredientAction | RemoveIngredientAction | RecipeAction;

interface ProviderProps {
  children: ReactNode;
}

const initialState: State = {
  selectedIngredients: [],
  selectedRecipe: null,
};

const globalReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_INGREDIENT":
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
      return state;
    case "REMOVE_INGREDIENT":
      return {
        ...state,
        selectedIngredients: state.selectedIngredients.filter(
          (_, i) => i !== action.payload
        ),
      };
    case "SELECT_RECIPE":
      return {
        ...state,
        selectedRecipe: action.payload,
      };
    case "CLEAR_ALL":
      return {
        ...state,
        selectedIngredients: [],
        selectedRecipe: null,
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
