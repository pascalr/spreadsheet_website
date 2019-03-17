import React from 'react'

import 'fixed-data-table-2/dist/fixed-data-table.css';

const { Table, Column, Cell } = require('fixed-data-table-2');

const MyCustomCell = (props) => {
  const row = props.data[props.rowIndex]
  return(<Cell>
    {row ? row[props.columnKey] : null}
  </Cell>);
}

class FixedDataTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.def || !this.props.data) {return null;}
    //rowsCount={Object.keys(this.props.defs).length}
    return (
      <Table
        rowHeight={30}
        headerHeight={30}
        rowsCount={this.props.data.length}
        width={1920}
        height={1000}
        {...this.props}>
        {this.props.def.columns.map(e => (
          <Column
            key={e.name}
            columnKey={e.name}
            header={<Cell>{e.name}</Cell>}
            cell={<MyCustomCell data={this.props.data} />}
            width={500}
          />
        ))}
      </Table>
    );
  }
}

export default FixedDataTable;
