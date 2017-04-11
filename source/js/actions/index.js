import {createAction} from 'redux-actions'

export const UPDATE_GRID_STATE = 'UPDATE_GRID_STATE'
export const UPDATE_GRID_FILTERS = 'UPDATE_GRID_FILTERS'

export const updateGridState = createAction(UPDATE_GRID_STATE)
export const updateGridFilters = createAction(UPDATE_GRID_FILTERS)

