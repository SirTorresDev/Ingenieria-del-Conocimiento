import React from "react";
import ColComp from "./column";


const RowComp = (props) => {
  //console.log(props);
  return (
    <tr>  
      {props.cols.map((column) => (
        <ColComp key={column} row ={props.row} column={column} setPosition={props.setPosition} setValueInit = {props.setValueInit} setValueFinish = {props.setValueFinish} setClean={props.setClean} setWall ={props.setWall} setDangerous={props.setDangerous} setWaypoint={props.setWaypoint}/>
      ))}
    </tr>
  );

};

export default RowComp;
