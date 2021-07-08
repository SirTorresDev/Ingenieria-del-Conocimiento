import React from "react";

const handleClick = (props) => {
  props.setPosition(props.row,props.column,props.setValueInit,props.setValueFinish, props.setClean, props.setWall, props.setDangerous, props.setWaypoint)

}

const ColComp = (props) => {
  return <td row={props.row} onClick = {() => handleClick(props)}><a id="cell"href >⛅</a></td>;
};

export default ColComp;
