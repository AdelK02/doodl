// Redux Store Setup
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    chat: chatReducer,
  },
});