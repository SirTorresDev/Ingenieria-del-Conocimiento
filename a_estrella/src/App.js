import React, { useState, useEffect } from "react";
import "./styles/App.css";
import RowComp from "./components/row";
import {boardtoMatrix, findTrip, drawPath, clearPath, findTripWithWaypoints} from "./javascripts/algorithm";

export default function App() {
  const [col, setCol] = useState([]); //Indices para el tablero
  const [row, setRow] = useState([]);
  const [colInit, setColInit] = useState(null); //Indices para la posicion de Inicio
  const [rowInit, setRowInit] = useState(null);
  const [colFinish, setColFinish] = useState(null); //Indices para la posicion Final
  const [rowFinish, setRowFinish] = useState(null);
  const [actualCol, setActualCol] = useState([]);  //Indices para la posicion Actual
  const [actualRow, setActualRow] = useState([]);
  const [dangerousPos, setDangerousPos] = useState([]);
  const [wallPos, setWallPos] = useState([]);
  const [waypointPos, setWaypointPos] = useState([]);
  const [path,setPath] = useState([]);
  const [needValueInit,setValueInit] = useState(false); //Booleanos para los botones
  const [needValueFinish,setValueFinish] = useState(false);
  const [cleanActive,setCleanActive] = useState(false);
  const [needValueDangerous,setValueDangerous] = useState(false);
  const [needValueWall,setValueWall] = useState(false);
  const [needValueWaypoint, setValueWaypoint] = useState(false);

  const setPosition = (row,column,needValueInit,needValueFinish, cleanActive, needValueWall, needValueDangerous, needValueWaypoint) =>{
    needValueInit ? setInitPosition(row,column) : needValueFinish ? setFinalPosition(row,column) : needValueDangerous ? setDangerousPosition(row,column) : needValueWall ? setWallPosition(row,column) : cleanActive ? clean(row,column) : needValueWaypoint ? setWaypointPosition(row,column) : null
    setActualRow(row);
    setActualCol(column);
    
  }

  const setInitPosition = (row,col) =>{
    if(rowInit != null && colInit != null){
      let prevCellInit = document.getElementById("board1").rows[rowInit].cells[colInit];
      prevCellInit.style.backgroundColor= "white";
      prevCellInit.innerText = "⛅";
      prevCellInit.style.fontSize = "35px";
     
    }
    setRowInit(row);
    setColInit(col);
    setValueInit(false);
    let cellInit = document.getElementById("board1").rows[row].cells[col];
    cellInit.style.backgroundColor= "#23d5ab";
    cellInit.innerText = "🛫";
    cellInit.style.fontSize = "35px";
   
  }

  const setFinalPosition = (row,col) => {
    if(rowFinish != null && colFinish != null){
      let prevCellFinish = document.getElementById("board1").rows[rowFinish].cells[colFinish];
      prevCellFinish.style.backgroundColor= "white";
      prevCellFinish.innerText = "⛅";
      prevCellFinish.style.fontSize = "35px";
      
    }
    setRowFinish(row);
    setColFinish(col);
    setValueFinish(false);
    let cellFinish = document.getElementById("board1").rows[row].cells[col];
    cellFinish.style.backgroundColor= "green"
    cellFinish.innerText = "🛕";
    cellFinish.style.fontSize = "35px";
    
  }

  const setDangerousPosition = (rowDangerous, colDangerous) => {
    setDangerousPos((prevPosDangerous) => prevPosDangerous.concat({rowDangerous,colDangerous}))
    let cellDangerous = document.getElementById("board1").rows[rowDangerous].cells[colDangerous];
    cellDangerous.style.backgroundColor= "orange";
    cellDangerous.innerText = "⚡";
    cellDangerous.style.fontSize = "35px";
    
  }

  const setWallPosition = (rowWall, colWall) => {
    setWallPos((prevRowWall) => prevRowWall.concat({rowWall,colWall}))
    let cellWall = document.getElementById("board1").rows[rowWall].cells[colWall];
    cellWall.style.backgroundColor= "red";
    cellWall.innerText = "🌋";
    cellWall.style.fontSize = "35px";
    
  }

  const setWaypointPosition = (rowWaypoint, colWaypoint) => {
    setWaypointPos((prevPosWaypoint) => prevPosWaypoint.concat({rowWaypoint,colWaypoint}))
    let cellWaypoint = document.getElementById("board1").rows[rowWaypoint].cells[colWaypoint];
    cellWaypoint.style.backgroundColor= "#b48cfa";
    cellWaypoint.innerText = "🌠";
    cellWaypoint.style.fontSize = "35px";
    
  }


  const clean = (rowClean,colClean) => {
    let cell = document.getElementById("board1").rows[rowClean].cells[colClean];
    cell.style.backgroundColor = "white";
    cell.innerText = "⛅";
    cell.style.fontSize = "35px";
    (rowClean === rowInit && colClean === colInit) ? (setRowInit(null) ,setColInit(null)) : null;
    (rowClean === rowFinish && colClean === colFinish) ? (setRowFinish(null) ,setColFinish(null)) : null;
    let indexDangerous = dangerousPos.findIndex(function (element) { 
      return (element.rowDangerous == rowClean && element.colDangerous == colClean);
     })
     if(indexDangerous != -1){
       let arrayDangerous = dangerousPos;
       dangerousPos.splice(indexDangerous,1);
       setDangerousPos(arrayDangerous);
     }
    let indexWall = wallPos.findIndex(function (element) { 
      return (element.rowWall == rowClean && element.colWall == colClean);
    }) 
    if(indexWall != -1){
      let arrayWalls = wallPos;
      wallPos.splice(indexWall,1);
      setWallPos(arrayWalls);
    }
    //setCleanActive(false,setCleanActive); //Funcion para que puedas borrar todo el rato o de uno en uno


  }

  const activateInitButton = () =>{
    !needValueFinish ? setValueInit(true) : null
  }

  const activateFinishButton = () =>{
    !needValueInit ? setValueFinish(true) : null
  }

  const start = () =>{
    
    setValueDangerous(false), setCleanActive(false), setValueWall(false), setValueInit(false), setValueFinish(false), setValueWaypoint(false);
    (colInit != null && rowInit != null) ? null : alert("Falta la celda de inicio");
    (colFinish != null && rowFinish != null) ? null : alert("Falta la celda de la Meta");
    if(!(colInit == null && rowInit == null) && !(colFinish == null && rowFinish == null)){
      path.length == 0 ? null : clearPath(row.length,col.length,path,rowInit,colInit,rowFinish,colFinish);
      boardtoMatrix(row.length,col.length,rowInit,colInit,rowFinish,colFinish,wallPos,dangerousPos,waypointPos);
      let newPath;
      waypointPos.length > 0 ? newPath = findTripWithWaypoints() : newPath = findTrip(); //Si he colocado algun waypoint que se ejecute con waypoints si no el normal
      setPath(newPath);
      !newPath.length ? alert("No hay solución") : drawPath(newPath,rowInit,colInit,rowFinish,colFinish,waypointPos);
      console.log(newPath);
    }
    
      

  }


  const crearArreglo = (ncol, callback) => {
    let r = [];
    for (let i = 0; i < ncol; i++) {
      r.push(i);
    }
    callback(r);
  };



  useEffect(() => {
    crearArreglo(6, setCol);
    crearArreglo(6, setRow);
    
  }, []);

  return (
    <div className="App">
      <div className="mainPanel">
        <div className="board">
          <table className="boardTable" id ="board1">
            {row.length !== 0 ? row.map((fila) => <RowComp key = {fila} cols={col} row={fila} setPosition={setPosition} setValueInit={needValueInit} setValueFinish={needValueFinish} setClean={cleanActive} setWall ={needValueWall} setDangerous={needValueDangerous} setWaypoint={needValueWaypoint}/>) : null}
          </table>
          </div>
          <div className="properties">
            <p>Columnas</p>
            <input
              type="number"
              value={col.length}
              min="0"
              max="100"
              onChange={(e) => crearArreglo(e.target.value, setCol)}
            />
            <p>Filas</p>
            <input
              type="number"
              value={row.length}
              min="0"
              max="100"
              onChange={(e) => crearArreglo(e.target.value, setRow)}
            />
            <br></br>
            <br></br>
            <p>Origen</p>
            <label>({rowInit},{colInit})</label>
            <p>Destino</p>
            <label>({rowFinish},{colFinish})</label>
            <br></br>
            <br></br> 
            <button className="btn draw-border" onClick = {activateInitButton} id="place_start_button">Colocar Inicio</button>
            <button className="btn draw-border" onClick = {activateFinishButton} id="place_goal_button">Colocar meta</button>
            <br></br>
            <button className="btn draw-border" onClick = {() => (setValueWaypoint(true), setValueWall(false), setValueDangerous(false), setCleanActive(false), setValueInit(false), setValueFinish(false))} id="place_barrier_button">Colocar Waypoint</button>
            <br></br>
            <button className="btn draw-border" onClick = {() => (setValueWall(true), setValueDangerous(false), setCleanActive(false), setValueInit(false), setValueFinish(false), setValueWaypoint(false))} id="place_barrier_button">Colocar Barrera</button>
            <br></br>
            <button className="btn draw-border" onClick = {() => (setValueDangerous(true), setCleanActive(false), setValueWall(false),setValueInit(false), setValueFinish(false), setValueWaypoint(false))} id="dangerous_cell_button">Celda Peligrosa</button>
            <br></br>
            <button className="btn draw-border" onClick = {() => (setCleanActive(true), setValueWall(false), setValueDangerous(false), setValueInit(false), setValueFinish(false), setValueWaypoint(false))} id="clear_cell_button">Vaciar Celda</button>
            <br></br>
            <button className="btn draw-border" onClick = {start} id="start">Empezar</button>

          </div>
        </div>
        
        <footer className="footer">
          <h3 id="footer-name">Desarollado por <strong>Roberto Torres Prensa</strong></h3>
          <p>Ingeniería del Conocimiento 2020-2021, Universidad Complutense de Madrid (UCM)</p>
        </footer>
      </div>
  );
}


