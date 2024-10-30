import React, { ReactNode, createContext, useReducer } from "react";

export interface Rating {
  rating: number;
}

export interface Comment {
  username: string;
  comment: string;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  cookTime: number;
  steps: string[];
  ratings: Rating[];
  comments: Comment[];
  matchedIngredients: any;
  ingredients: string[];
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

interface UpdateRatingsAction {
  type: "UPDATE_RATINGS";
  payload: Rating[];
}

interface UpdateCommentsAction {
  type: "UPDATE_COMMENTS";
  payload: Comment[];
}

type Action =
  | IngredientAction
  | RemoveIngredientAction
  | RecipeAction
  | UpdateRatingsAction
  | UpdateCommentsAction;

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
    case "UPDATE_RATINGS":
      if (state.selectedRecipe) {
        return {
          ...state,
          selectedRecipe: {
            ...state.selectedRecipe,
            ratings: action.payload,
          },
        };
      } else {
        return state;
      }

    case "UPDATE_COMMENTS":
      if (state.selectedRecipe) {
        return {
          ...state,
          selectedRecipe: {
            ...state.selectedRecipe,
            comments: action.payload,
          },
        };
      } else {
        return state;
      }
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
