import React, { useState, useRef} from "react";
import "./styles/App.css";
import Tree from 'react-tree-graph';

var DecisionTree = require("decision-tree");

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [decisionTree, setDecisionTree] = useState("");
  const [prediction, setPrediction] = useState([]);
  const [result, setResult] = useState("")

  
    const refData = useRef();
    const refAttributes = useRef();

    const handleSubmitData = (e) =>{
      e.preventDefault();
      let file = refData.current.files[0];
      if (file.type === 'text/plain') {
        debugger
        setFile(file);
        getFileContentsData(file);

        

      } else {
        alert('¡He dicho archivo de texto!');
      }
    }

    const handleSubmitAttributes = (e) =>{
      debugger
      e.preventDefault();
      let file = refAttributes.current.files[0];
      if (file.type === 'text/plain') {
        getFileContentsAttributes(file);
      } else {
        alert('¡He dicho archivo de texto!');
      }
    }

    const setField = (e) =>  {
      setPrediction({[e.target.name]: e.target.value})
     }

    const handleSubmitPrediction = (e) =>{
      e.preventDefault();
      leerPrediccion()
    }

    async function getFileContentsData(file) {
      const reader = new FileReader();
      reader.readAsText(file);
      const arrayresult = await new Promise((resolve, reject) => {
        reader.onload = function(event) {
          resolve(reader.result)
        }
      })
      transformData(arrayresult)
    }

    async function getFileContentsAttributes(file) {
      const reader = new FileReader();
      reader.readAsText(file);
      const arrayresult = await new Promise((resolve, reject) => {
        reader.onload = function(event) {
          resolve(reader.result)
        }
      })
      transformAttributtes(arrayresult)
    }
  
  const transformData  = (arrayresult) => {
    console.log("Se van a leer los datos");
        console.log("Se ha seleccionado el archivo", file);
        var lines = arrayresult.split("\n").filter(Boolean);
        var object = lines.map(line => {
            var array = line.toString().split("\,");
            array = array.toString().split("\r");
            return array.filter(element => element);
        });
        object = object.map(auxArray => auxArray.toString().split("\,"));
        console.log("No file selected", object);
        setData(object);
  }

  const transformAttributtes = (arrayresult) =>{
    console.log("Se van a leer los atributos");
    var lines = arrayresult.split("\r");
    arrayresult = arrayresult.toString().split("\n");
    arrayresult = arrayresult.toString().split("\,");
        console.log("Los atributos son: ", arrayresult);
        setAttributes(arrayresult);
  }

  const crearArbol= () =>{
    debugger
    if (attributes.length !== 0 && data.length !== 0) {
        var attribute = attributes.filter(element => element);
        var trainingData = data.map(data => {
            var result = {};
            attribute.forEach((key, i) => result[key] = data[i]);
            return result;
        });
        var className = attribute.pop();


        var dt = new DecisionTree(trainingData, className, attribute);
        var treeJson = dt.toJSON();
        console.log("AAAAAAAAAAAAAA", treeJson);
        var result = createTree(treeJson);
        setAttributes(attribute);
        setData(result);
        setDecisionTree(dt);
    } else {
       alert("Tienes que tener seleccionados dos archivos con los datos y atributos" );
    }
  }

  const createTree = (jsonTree) => {
    var data = {};
    var children = [];

    data["name"] = jsonTree.name;
    if (jsonTree.type === "result") {
        console.log("LLego a un result");
    } else if (jsonTree.type === "feature_value") {
        if (jsonTree.child) {
            var res = createTree(jsonTree.child);
            children.push(res);
        }
    } else if (jsonTree.type === "feature") {
        if (jsonTree.vals) {
            jsonTree.vals.forEach(child => {
                var res = createTree(child);
                children.push(res);
            });
        }
        console.log("Termino un nodo feature", data);
    }
    data["children"] = children;
    return data;
  }

  const reset = () => {
    setAttributes([]);
    setData("");
    setDecisionTree([]);
    setFile([]);
    setPrediction("");
    setResult("");
  }

  const leerPrediccion = () => {
    console.log("Se van a leer los atributos", prediction);
    var array = prediction.name;
        array = array.toString().split("\n");
        array = array.toString().split("\,");
        console.log("Los atributos son: ", array);

        var res = {};
        attributes.forEach((key, i) => res[key] = array[i]);

        var predicted_class = decisionTree.predict(res);
        setPrediction(array);
        
        setResult(predicted_class);
  }
  
  return (
    <div className="App">
      <div className="mainPanel">
        <div className="board">
          <div className="tree">
            {data &&<Tree
              data={data}
              height={500}
              width={500} />
            }
            <div className="result">
            {
              result ? <h2>El resultado es: <strong>{result}</strong></h2> : null
            }
            </div>
          </div>
          <div className="properties">
            <label>Selecciona un fichero CON LOS DATOS del juego</label>
            <form onSubmit={handleSubmitData}>
              <input className ="btnData draw-border" type="file" ref={refData} required></input>
              <button className="btn draw-border">Submit</button>
            </form>
            <br></br>
            <br></br>
            <label>Selecciona un fichero CON LOS ATRIBUTOS</label>
            <form onSubmit={handleSubmitAttributes}>
              <input className ="btnAttribute draw-border" type="file" ref={refAttributes} required></input>
              <button className="btn draw-border">Submit</button>
            </form>
            <br></br>
            <button className="btnReset draw-border" onClick={() => reset()}>RESET</button>
            <button className="btnCreate draw-border" onClick={() => crearArbol()}>Crea tu arbol de Desición</button>
            <br></br>
            {/* <label>Introduce la Prediccion</label> */}
            <form onSubmit={handleSubmitPrediction}>
              <input type="text" id="name" name="name" className="btnP draw-border" placeholder="Introduce la Prediccion" size="32"  onChange={(e)=>setField(e)}required></input>
              <button className="btnPre draw-border submitB">Submit</button>
            </form>
            

          </div>
        </div>
        <footer className="footer">
          <h3 id="footer-name">Desarollado por <strong>Roberto Torres Prensa</strong></h3>
          <p>Ingeniería del Conocimiento 2020-2021, Universidad Complutense de Madrid (UCM)</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
