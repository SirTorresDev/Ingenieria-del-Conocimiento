
let matrix = undefined;


let startNode = undefined
let goalNode = undefined
let goalNodeAux = undefined

let waypointsArray = [];



let caminoEncontrado = false;

/**
 * Save the current board into the matrix
 */


export const boardtoMatrix = (rows,columns,rowInit,colInit,rowFinish,colFinish,wallPos,dangerousPos,waypointPos) => {
    caminoEncontrado = false;
    matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) {
            //Start

            if (i == rowInit && j == colInit ) {
                startNode = { i, j, f: 0, g: 0, h: undefined, parent: undefined, dangerous: 0, height: 5,  representation: "*" };
                matrix[i][j] = startNode;
            }
            //Goal
            else if (i == rowFinish && j == colFinish) {
                goalNode = { i, j, f: undefined, g: undefined, h: undefined, parent: undefined, dangerous: 0, height: 5, representation: "#" };
                matrix[i][j] = goalNode;
            }
            //Barrier
            else if (wallPos.findIndex(function (element) { 
                return (element.rowWall == i && element.colWall == j);
            }) != -1){
                matrix[i][j] = { i, j, f: undefined, g: undefined, h: undefined, parent: undefined, dangerous: 0, height: " ", representation: "X" };
            } 

            //Dangerous
            else if (dangerousPos.findIndex(function (element) { 
                return (element.rowDangerous == i && element.colDangerous == j);
            }) != -1){
                matrix[i][j] = { i, j, f: undefined, g: undefined, h: undefined, parent: undefined, dangerous: 1, height: Math.floor(Math.random() * 10) + 1, representation: "^" };
            } 
            //Waypoint
            else if(waypointPos.findIndex(function (element) { 
                return (element.rowWaypoint == i && element.colWaypoint == j);
            }) != -1){
                let waypointNode = { i, j, f: 0, g: 0, h: undefined, parent: undefined, dangerous: 0, height: 5,  representation: "/" };
                waypointsArray.push(waypointNode);
                matrix[i][j] = waypointNode;
            }

            //Empty
            else
                matrix[i][j] = { i, j, f: undefined, g: undefined, h: undefined, parent: undefined, dangerous: 0, height: Math.floor(Math.random() * 10) + 1, representation: " " };
        }
        
    }
    
    startNode.h = h(startNode);
    startNode.f = startNode.h;
    
    // //Para mostrar alturas descomentar
    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < columns; j++) {
    //         let cell = document.getElementById("board1").rows[i].cells[j];
    //         cell.innerText = cell.innerText + matrix[i][j].height;
    //     }
    // }
}


/********************************************************* */
/****************ALGORITHIM A STAR *********************** */
/********************************************************* */

export const findTrip = () => {
    let openList = [];
    let closeList = [];
    let trip = [];

    openList.push(startNode);
    
    //while the open list isn't empty and we don't find the end
    while (openList.length > 0 && !caminoEncontrado) {
        let min = Infinity;
        let nodeSelected = undefined;
        //get node with less f
        openList.forEach(node => {
            if (node.f < min) {
                min = node.f;
                nodeSelected = node;
            }
        })
        //if the less node is goalNode
        if (compareNodes(nodeSelected, goalNode)) {
            goalNode.parent = nodeSelected.parent;
            caminoEncontrado = true;
            //create solution(path) and return it
            while (nodeSelected.parent != undefined) {
                trip.push(nodeSelected);
                nodeSelected = nodeSelected.parent;
            }
            trip.push(startNode);

        }
        else {//put the less node isn't the goal
            //put it in the close list
            closeList.push(nodeSelected);
            //remove it from the open list
            openList.splice(openList.indexOf(nodeSelected), 1);
            //expand node

            //search Neighbours
            let neighboursList = getNeighbours(nodeSelected);
            neighboursList.forEach(neighbour => {
                //if the neighbour doesn't appear in close, open list and the node is not a barrier or the start
                if (closeList.indexOf(neighbour) == -1 && neighbour.representation != "X" && openList.indexOf(neighbour) == -1 && neighbour.representation != "*" ){//&& nodeSelected.height + 5 > neighbour.height) { Descomentar para version con altura
                    neighbour.parent = nodeSelected;
                    neighbour.g = (nodeSelected.i != neighbour.i && nodeSelected.j != neighbour.j) ? (nodeSelected.g + Math.sqrt(2)) : (nodeSelected.g + 1);
                    neighbour.h = h(neighbour);
                    neighbour.f = neighbour.g + neighbour.h + neighbour.dangerous;
                    openList.push(neighbour);
                }
                //if the neighbour doesn't appear in close, and appears open list
                else if (closeList.indexOf(neighbour) == -1 && neighbour.representation != "X" && openList.indexOf(neighbour) != -1 && neighbour.representation != "*" ){//&& nodeSelected.height + 5 > neighbour.height) { Descomentar para version con altura
                    //calculate new F
                    let gAux = (nodeSelected.i != neighbour.i && nodeSelected.j != nodeSelected.j) ? (nodeSelected.g + Math.sqrt(2)) : (nodeSelected.g + 1);
                    let hAux = h(neighbour);
                    let fAux = gAux + hAux + neighbour.dangerous;
                    //update F
                    if (fAux < neighbour.f) {
                        neighbour.f = fAux;
                        neighbour.h = hAux;
                        neighbour.g = gAux;
                        neighbour.parent = nodeSelected;
                    }

                }
            })

        }
    }
    return trip;
   
}


export const findTripWithWaypoints = () => { //Invoca a findTrip() varias veces (Desde I -> WayPoint1, Waypoint1 -> WaypOint2,..., WayPoint-> Meta)
    let trip = [];
    let aux = [];
    goalNodeAux = goalNode; //Guardamos el valor de nuestro goal
    goalNode = nextWaypoint(waypointsArray); //El final va a ser nuestro waypoint 
    waypointsArray.splice(goalNodeAux,1);

    aux = findTrip(); //Calculamos el camino desde el inicio hasta el waypoint
    if (aux.length == 0) {
        return [];
    }
    trip.push.apply(trip,aux); //Añade a la posicion dada aux
    trip.reverse();
    let end = false;
    
    while(waypointsArray.length >= 0 && end == false) {
        startNode = goalNode;
        if(waypointsArray.length == 0) {
            end = true;
            goalNode = goalNodeAux; //Ponemos que el nodo final es el final del tablero origal
        }
        else {
            goalNode = nextWaypoint(waypointsArray); 
            waypointsArray.splice(goalNode,1);
        }
        caminoEncontrado = false;
        let object ={parent: undefined}
        startNode.parent = object.parent;
        aux = findTrip(); //calculamos el camino desde el ultimo waypoint hasta el goal marcado
        if(aux.length != 0) {
            aux.pop();
            aux.reverse();
            trip.push.apply(trip,aux);
        }
        else {
            return [];
        }
    }
     trip.reverse();
    return trip;
}

function nextWaypoint(waypointPos){
    if(waypointPos.length > 0) {
        let firstWaypoint = waypointPos[0];
        let minorLenght = h(startNode);
        let iMenor = 0;
        let i = 1;
        while (i < waypointPos.length) {
            let waypoint = waypointPos[i];
            let waypointC = h(startNode);
            if (minorLenght > waypointC) {
                minorLenght = waypointC;
                iMenor = i;
            }
            i++;
        }
        return waypointPos[iMenor];
    }
    return null;
}

/**
 * Returns the heuristic distance between node gicen and the goalNode
 * @param {*} actualNode 
 */
function h(actualNode) {
    return Math.sqrt(Math.pow((goalNode.i - actualNode.i), 2) + Math.pow((goalNode.j - actualNode.j), 2));
}

/**
 * Two nodes are equal if their corrdinates are the same
 * @param {*} a 
 * @param {*} b 
 */
function compareNodes(a, b) {
    return (a.i == b.i && a.j == b.j);
}

/**
 * Get Neighbours given a node
 * @param {*} node 
 */
function getNeighbours(node) {
    let x = node.i;
    let y = node.j;
    let neighbours = [];
    if (x - 1 >= 0 && y - 1 >= 0) neighbours.push(matrix[x - 1][y - 1]);
    if (y - 1 >= 0) neighbours.push(matrix[x][y - 1]);
    if (x + 1 < matrix.length && y - 1 >= 0) neighbours.push(matrix[x + 1][y - 1]);
    if (x - 1 >= 0) neighbours.push(matrix[x - 1][y]);
    if (x + 1 < matrix.length) neighbours.push(matrix[x + 1][y]);
    if (x - 1 >= 0 && y + 1 < matrix[0].length) neighbours.push(matrix[x - 1][y + 1]);
    if (y + 1 < matrix[0].length) neighbours.push(matrix[x][y + 1]);
    if (x + 1 < matrix.length && y + 1 < matrix[0].length) neighbours.push(matrix[x + 1][y + 1]);

    return neighbours;

}
const drawElement = (path,elem,rowInit,colInit,rowFinish,colFinish,waypointPos) =>{
    setTimeout(() => {
        if(!(path[elem].i == rowInit && path[elem].j == colInit) && !(path[elem].i == rowFinish && path[elem].j == colFinish) && (waypointPos.findIndex(function (element) { 
            return (element.rowWaypoint == path[elem].i && element.colWaypoint == path[elem].j);
        }) == -1)){
            let cellPath = document.getElementById("board1").rows[path[elem].i].cells[path[elem].j];
            cellPath.style.backgroundColor= "#dcfaea" 
            //let contenido = cellPath.innerText;  Descomentar para version con altura
            cellPath.innerText = "🛬";
            //cellPath.innerText = "🛬" + contenido; //Descomentar para version con altura
            cellPath.style.fontSize = "35px";
            
        }  
    }, elem * 100);
         
}

export const drawPath = (path,rowInit,colInit,rowFinish,colFinish,waypointPos) => {
    path = path.reverse();
    for (let elem = 0; elem < path.length; elem++){ 
        drawElement(path,elem,rowInit,colInit,rowFinish,colFinish,waypointPos);    
    }
}


export const clearPath = (rows,columns,path,rowInit,colInit,rowFinish,colFinish) =>{
    if(matrix != undefined){
        
        path.forEach(elem => { 
            if(!(elem.i == rowInit && elem.j == colInit) && !(elem.i == rowFinish && elem.j == colFinish)){
                let cellPath = document.getElementById("board1").rows[elem.i].cells[elem.j];
                cellPath.innerText == "🛬" ? (
                    cellPath.style.backgroundColor= "white",
                    cellPath.innerText = "⛅",
                    cellPath.style.fontSize = "35px"
                ) : null 
                
            }
        })
        // //Clear matrix solo para version de alturas
        // for (let i = 0; i < rows; i++) {
        //     for (let j = 0; j < columns; j++) {
        //         if(!(i == rowInit && j == colInit) && !(i == rowFinish && j == colFinish)){
        //             let cell = document.getElementById("board1").rows[i].cells[j];
        //             let contenido = cell.innerText;
        //                 cell.innerText = contenido.substr(0,1);
        //                 cell.style.fontSize = "35px"
        //                 cell.style.backgroundColor= "white";
        //         }
        //         else {
        //             let cell2 = document.getElementById("board1").rows[i].cells[j];
        //             let contenido2 = cell2.innerText;
        //             cell2.innerText = contenido2.substr(0,2);
        //         }
                    
                
        //     }
        // }
    }
    
}   




