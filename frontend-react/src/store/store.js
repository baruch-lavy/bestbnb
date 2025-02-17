import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk"; // ✅ Correct import

import { stayReducer } from "./reducers/stay.reducer";
import { userReducer } from "./reducers/user.reducer";
import { reviewReducer } from "./reducers/review.reducer";
import { systemReducer } from "./reducers/system.reducer";
import { searchReducer } from "./reducers/stay.reducer"; // Make sure this is correct!

// ✅ Combine reducers
const rootReducer = combineReducers({
  stayModule: stayReducer,
  userModule: userReducer,
  systemModule: systemReducer,
  reviewModule: reviewReducer,
  search: searchReducer,
});

// ✅ Enable Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// ✅ Apply middleware correctly
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk))); 

// ✅ Debugging (Optional)
store.subscribe(() => {
});
