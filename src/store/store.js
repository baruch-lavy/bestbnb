import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux"

import { stayReducer } from "./reducers/stay.reducer"
import { orderReducer } from './reducers/order.reducer'
import { userReducer } from "./reducers/user.reducer"
import { reviewReducer } from "./reducers/review.reducer"
import { systemReducer } from "./reducers/system.reducer"
import { searchReducer } from "./reducers/stay.reducer" 

// ✅ Combine reducers
const rootReducer = combineReducers({
  stayModule: stayReducer,
  orderModule: orderReducer,
  userModule: userReducer,
  systemModule: systemReducer,
  reviewModule: reviewReducer,
  search: searchReducer,
})

const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
