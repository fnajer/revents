import { MODAL_OPEN, MODAL_CLOSE } from './modalConstants'

import { createReducer } from '../../app/common/util/reducerUtil'

const initialState = null;

const modalOpen = (state, payload) => {
  const { modalType, modalProps } = payload;
  return {
    modalType,
    modalProps,
  };
};

export const modalClose = (state, payload) => {
  return null;
};

export default createReducer(initialState, {
  [MODAL_OPEN]: modalOpen,
  [MODAL_CLOSE]: modalClose,
});