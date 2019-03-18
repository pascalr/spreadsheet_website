import React from 'react'

const ByPass = (props) => props.if ? (props.children.props.children) : props.children

export default ByPass;
