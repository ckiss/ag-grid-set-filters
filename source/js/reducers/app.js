import {
  UPDATE_GRID_FILTERS,
  UPDATE_GRID_STATE
} from '../actions'

const initialState = ({
  gridState: {},
  filterState: {}
});

const makeState = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRID_STATE: {
      const {gridState} = action.payload
      return {...state, gridState}
    }

    case UPDATE_GRID_FILTERS: {
      const filterState = action.payload
      return {...state, filterState}
    }
    default:
      return state
  }
}

export default makeState
