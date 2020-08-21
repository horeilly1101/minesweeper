import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers/updateGameState";

export default createStore(rootReducer, applyMiddleware(thunk));
