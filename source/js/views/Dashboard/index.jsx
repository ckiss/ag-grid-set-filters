import React, {Component, PropTypes as T} from 'react'
import {AgGridReact} from 'ag-grid-react'
import {connect} from 'react-redux'
import {updateGridState, updateGridFilters} from '../../actions'
import {getTableData, getTableDataRevision} from './utils'
import {isEmpty} from 'lodash/fp'

import enterprise from 'ag-grid-enterprise'
enterprise.LicenseManager.setLicenseKey('PUT_LICENSE_KEY_HERE')

@connect(state => {
  return {
    gridState: state.app.gridState,
    filterState: state.app.filterState
  }
}, {
  updateGridState: updateGridState,
  updateGridFilters: updateGridFilters
})
export default class Dashboard extends Component {
  static propTypes = {
    gridState: T.object.isRequired,
    filterState: T.object.isRequired,
    updateGridState: T.func.isRequired,
    updateGridFilters: T.func.isRequired
  }

  constructor () {
    super()

    this.state = {
      columnDefs: [],
      gridRowData: []
    }
  }

  componentDidMount () {
    const table = getTableData()
    this.setState({
      columnDefs: this.createColumnDefinitions(),
      gridRowData: table
    })
  }

  onGridReady = ({api, columnApi}) => {
    const {gridState, gridFilters} = this.props

    this.api = api
    this.columnApi = columnApi

    if (gridState) {
      const {columnState, sortState} = gridState

      if (columnState) {
        this.columnApi.setColumnState(columnState)
      }
      if (sortState) {
        this.api.setSortModel(sortState)
      }
    }

    if (gridFilters) {
      this.api.setFilterModel(gridFilters)
    }

    this.api.addEventListener('sortChanged', this.persistColState)
    this.api.addEventListener('filterChanged', this.persistFiltersState)
  }

  persistColState = () => {
    const {updateGridState} = this.props
    const gridState = {
      columnState: this.columnApi.getColumnState(),
      sortState: this.api.getSortModel()
    }

    updateGridState({gridState})
  }

  //filters are saved separately because we want to persist filters between tables
  persistFiltersState = () => {
    const {updateGridFilters} = this.props

    const filterState = this.api.getFilterModel()

    //don't reset any possible filters
    if (!isEmpty(filterState))
      updateGridFilters(filterState)

    this.api.refreshHeader()
  }

  loadTableData = revision => () => {
    const gridRowData = revision ? getTableDataRevision() : getTableData()
    const columnDefs = this.createColumnDefinitions(revision)

    this.setState({gridRowData, columnDefs})
  }

  createColumnDefinitions (revision) {
    if (revision) {
      return [
        {
          headerName: "Athlete",
          field: "athlete",
          width: 150,
          filter: 'set',
          filterParams: {cellHeight: 20}
        },
        {headerName: "Age", field: "age", width: 90, filter: 'number'},
        {headerName: "Country", field: "country", width: 140, filter: 'set'}
      ]
    } else {
      return [
        {headerName: "No.", field: "id", width: 20},
        {
          headerName: "Athlete",
          field: "athlete",
          width: 150,
          filter: 'set',
          filterParams: {cellHeight: 20}
        },
        {headerName: "Age", field: "age", width: 90, filter: 'number'},
        {headerName: "Country", field: "country", width: 140, filter: 'set'}
      ]
    }
  }

  onGridColumnsChanged = () => {
    debugger
    const {filterState} = this.props
    if (filterState && this.api) {
      this.api.setFilterModel(filterState)
    }
  }

  render () {
    const {columnDefs, gridRowData} = this.state

    return (
      <div className='dashboard'>
        <h2>AG-GRID test</h2>
        <hr />
        <div>
          <button onClick={this.loadTableData()}>table data</button>
          <button onClick={this.loadTableData(true)}>revision table data</button>
        </div>
        <hr />
        <div className="ag-fresh my-grid">
          <AgGridReact
            ref="grid"
            onGridReady={this.onGridReady}
            columnDefs={columnDefs}
            enableColResize={false}
            enableSorting
            headerHeight={40}
            rowHeight={30}
            rowData={gridRowData}
            suppressMultiSort
            onGridColumnsChanged={this.onGridColumnsChanged} />
        </div>
      </div>
    )
  }
}
