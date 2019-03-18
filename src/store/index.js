import { createStore } from "redux";
import appReducer from "../reducers/index";

const store = createStore(appReducer);

export default store;
