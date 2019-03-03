import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';

import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

class DatasheetTable extends Component {
  constructor(props) {
    super(props)
    this.onCellsChanged = this.onCellsChanged.bind(this);
    let grid = null;
    if (props.grid == null) {
      grid = [[{value: ""}]];
    } else {
      grid = props.grid;
      // Add numbers to each line
      for (let i = 0; i < grid.length; i++) {
        grid[i].unshift({readOnly: true, value: i+1})
      }
      // Add letters to each column, if there is more than one
      let n_column = grid[1].length - 1;
      if (n_column > 1) {
        let letters = [{readOnly: true, value: ""}]
        for (let i = 0; i < n_column; i++) {
          letters.push({readOnly: true, value: String.fromCharCode(65 + i)})
        }
        grid.unshift(letters)
      }
    }
    this.state = {
      name: props.name,
      background_color: props.background_color,
      grid: grid
    }
  }
  
  onCellsChanged(changes) {
    console.log('onCellsChanged')
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      grid[row][col] = {...grid[row][col], value}
    })
    this.setState({grid})
  }

  render() {
    return (
      <div className="table" style={{backgroundColor: this.state.background_color}}>
        <div className="table_name">
          {this.state.name}
        </div>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
      </div>
    );
  }
}

function loadTables() {
  return (
    <div className="tables">
      <DatasheetTable name="TODO"
                      background_color="yellow"
                      grid = {[
                        [{value:  "Mettre a jour mes contacts"}],
                        [{value:  "Pouvoir ecrire en francais"}],
                        [{value:  "Prendre mon vieux vimrc"}]
                      ]}
      />
      <DatasheetTable name="Notes"
                      grid = {[
                        [{value:  1}],
                        [{value:  2}]
                      ]}
      />
      <DatasheetTable name="Musique" />
      <DatasheetTable name="Test"
                      grid = {[
                        [{value:  1},{value:  3}],
                        [{value:  2},{value:  4}]
                      ]}
      />
      <DatasheetTable name="Videos" />
      <DatasheetTable name="Emails" />
      <DatasheetTable name="Bookmarks" />
    </div>
  );
}

class App extends Component {
  render () {
    console.log("render App")
    return (
      loadTables()
    )
  }
}

export default App;
