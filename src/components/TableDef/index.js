import React from 'react';

class TableDefForm extends React.Component {
  onSubmit = event => {
    event.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="columns"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="columns"
        />
        <button type="submit">
          Update
        </button>
    )
  }
}

export default TableDefForm;
