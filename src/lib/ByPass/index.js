import React from 'react'

const ByPass = cond => (props) => cond ? (props.children.props.children) : props.children

export default ByPass;
