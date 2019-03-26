import { connect } from "react-redux";

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  set: path => val => dispatch(set(path,val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnMenu);
