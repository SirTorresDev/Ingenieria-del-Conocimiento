import React, {useState, useContext} from "react";
import "../styles/k-means.css"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {DataTraining} from './dataTraining';
import {basesIni, roundDecimals, formatCenters, formatResult, formatCentersFinal} from "../javascripts/formatData"




export default function Kmeans() {
    var irisSetosa = [];
    var irisVersicolor = [];
    var centrosSetosa = [];
    var centrosVersi = [];
    let basesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let defaultTolerancia = 0.01;
    let defaultPesoExponencial = 2;

   
    const {data} = useContext(DataTraining);
    const [tolerancia, setTolerancia] = useState(defaultTolerancia);
    const [pesoExponencial, setPesoExponencial] = useState(defaultPesoExponencial);
    const [centrosIniciales, setCentrosIniciales] = useState(basesIni(basesIniciales));
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);;
    const [newExample, setNewExample] = useState([]);
    const [allExamples, setAllExamples] = useState([]);
    const [result, setResult] = useState([]);

  
    const items = () =>{
        let array = [];
        for(let item in data){
            let formatData = data[item].values;
            formatData = formatData.map(element => {
                let String = "\n".concat(element.toString());
                return String;
            });
            array.push( 
            <label>{item}</label>,
            <TextareaAutosize
            className="dataArea" 
            rowsMax={8}
            aria-label="maximum height"
            placeholder="Data"
            defaultValue=""
            value={formatData}/>)
        } 
        return array
    }

    const setField1 = (e) =>  {
        setTolerancia({[e.target.name]: e.target.value})
    }

    const setField2 = (e) =>  {
        setPesoExponencial({[e.target.name]: e.target.value})
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setNewExample(e.target[0].value); 
        setAllExamples([...allExamples, "\n" + (allExamples.length+1) + ") " +e.target[0].value])  
    }

    const defaultValuesBases = () => {
        setCentrosIniciales(basesIni(basesIniciales));
    }

    const randomValuesBases = () => {
        let numCentros =  centrosIniciales.length;
        let numCoordenadas = centrosIniciales[0].slice(5,centrosIniciales[0].length-1);
        numCoordenadas = numCoordenadas.toString().split(",");
        numCoordenadas = numCoordenadas.length;
        let aux = {};
        for(let i = 1; i <= numCentros; i++){
            let array = new Array(numCoordenadas);
            aux[i] = array;
            for(let j = 0; j < numCoordenadas; j++) {
                aux[i][j] = roundDecimals(Math.random()* 10, 2);
            }
        }
        setCentrosIniciales(basesIni(aux));
    }

    const defaultValuesParams = () => {
        setTolerancia(defaultTolerancia);
        setPesoExponencial(defaultPesoExponencial);
    }

    const randomValuesParams = () => {
        setTolerancia(roundDecimals(Math.random(), 4) * 2 + 0.1); 
        setPesoExponencial(roundDecimals(Math.random()* 5 + 1.1 ,4));
    }

    const execute_kmeans = () => {
      if(data.length !== 0) kmeans();
      else alert("Primero introduce un fichero de datos");
    }



 /* FUNCIONES ASISTENTES PARA EL METODO K-MEDIAS */
 const kmeans = () => {//Funcion del Metodo de Ordenacion de KMedias
    irisSetosa = data["Iris-setosa"]["values"];
    irisVersicolor = data["Iris-versicolor"]["values"];
    centrosSetosa = formatCenters(centrosIniciales[0]);
    centrosVersi = formatCenters(centrosIniciales[1]);
    var salir = false; // indica si se han llegado a las condiciones
    var iteracion = 1;
    while (!salir) { // Hace el numero de iteraciones hasta que se hayan cumplido las condiciones.
      console.log('Iteracion numero: ' + iteracion);
      const exponente = 1 / (pesoExponencial - 1); // 1/(b-1)
      // Si hay el mismo numero de elementos en las 2 clases entonces basta con resolverlo 
      // para una de ellas y el resultado de la otra sera la resta de ese valor a 1
      var valores_d = [];
      for (let i = 0; i < irisSetosa.length; i++) { // Se calculan los valores de d para irisSetosa
        var res = [];
        var djSetosa = 0;
        var djVersicolor = 0;
        for (let j = 0; j < irisSetosa[i].length; j++) {
          djSetosa += Math.pow(irisSetosa[i][j] - centrosSetosa[j], 2);
          djVersicolor += Math.pow(irisSetosa[i][j] - centrosVersi[j], 2);
        }
        res.push(djSetosa); // valor [0] del array === Setosa
        res.push(djVersicolor); // valor [1] del array === VersiColor
        valores_d.push(res);
      }
    

      for (let i = 0; i < irisVersicolor.length; i++) { // Se calculan los valores de d para irisVersicolor
        res = [];
        djSetosa = 0;
        djVersicolor = 0;
        for (let j = 0; j < irisVersicolor[i].length; j++) {
          djSetosa += Math.pow(irisVersicolor[i][j] - centrosSetosa[j], 2);
          djVersicolor += Math.pow(irisVersicolor[i][j] - centrosVersi[j], 2);
        }
        res.push(djSetosa); // valor [0] del array === Setosa
        res.push(djVersicolor); // valor [1] del array === VersiColor
        valores_d.push(res);
      }

      var MatrizProbabilidadesK = []; // Matriz de probabilidades
      var sumasDeterminantes = [];
      for (let i = 0; i < valores_d.length; i++) {
        var auxi = 0;
        for (let j = 0; j < 2; j++) {
          auxi += Math.pow(1 / valores_d[i][j], exponente)
        }
        sumasDeterminantes.push(auxi);
      }


      for (let i = 0; i < valores_d.length; i++) {
        var aux = [];
        res = Math.pow(1 / valores_d[i][0], exponente) / sumasDeterminantes[i];
        aux.push(res);
        aux.push(1 - res);
        MatrizProbabilidadesK.push(aux);
      }
      console.log('Matriz de Prob ---------------------');
      console.log(MatrizProbabilidadesK);

    
      var nuevoCentroSetosa = [];
      var nuevoCentroVersi = [];

      for (let i = 0; i < centrosSetosa.length; i++) { // Nuevo Centro para la clase Iris Setosa
        var aux1 = 0;
        var aux2 = 0;
        for (let j = 0; j < irisSetosa.length; j++) {
          aux1 += Math.pow(MatrizProbabilidadesK[j][0], pesoExponencial) * irisSetosa[j][i];
          aux2 += Math.pow(MatrizProbabilidadesK[j][0], pesoExponencial);
        }
        for (let j = 0; j < irisVersicolor.length; j++) {
          aux1 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][0], pesoExponencial) * irisVersicolor[j][i];
          aux2 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][0], pesoExponencial);
        }
        nuevoCentroSetosa.push(aux1 / aux2);
      }

      for (let i = 0; i < centrosVersi.length; i++) { // Nuevo centro para la lase Iris Versicolor
        aux1 = 0;
        aux2 = 0;
        for (let j = 0; j < irisSetosa.length; j++) {
          aux1 += Math.pow(MatrizProbabilidadesK[j][1], pesoExponencial) * irisSetosa[j][i];
          aux2 += Math.pow(MatrizProbabilidadesK[j][1], pesoExponencial);
        }
        for (let j = 0; j < irisVersicolor.length; j++) {
          aux1 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][1], pesoExponencial) * irisVersicolor[j][i];
          aux2 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][1], pesoExponencial);
        }
        nuevoCentroVersi.push(aux1 / aux2);
      }
      console.log(nuevoCentroSetosa);
      console.log(nuevoCentroVersi);

      salir = criterioConver(nuevoCentroSetosa, nuevoCentroVersi);
      let newValue = [];
      newValue.push(nuevoCentroSetosa);
      newValue.push(nuevoCentroVersi);
      newValue = basesIni(newValue); //Formateo las bases para mostrarlas en la vista
      setCentrosObtenidos(newValue);
      centrosVersi = nuevoCentroVersi;
      centrosSetosa = nuevoCentroSetosa;
     

      console.log('Nuevo Centro Cetosa: ---- ');
      console.log(centrosSetosa)
      console.log('Nuevo Centro Versicolor: ---- ');
      console.log(centrosVersi)
      iteracion++;
    }
  }

  const criterioConver = (nuevoCentroSetosa, nuevoCentroVersi) => { // Compruba si se cumplen las condiciones de los nuevos centros o si se tiene que seguir iterando
    let i = 0;
    var aux1 = 0;
    while (i < centrosObtenidos.length) { //Comprueba el centro de Iris-Setosa
      aux1 += Math.pow(nuevoCentroSetosa[i] - centrosObtenidos[i], 2);
      i++;
    }
    if (Math.sqrt(aux1) > tolerancia) {
      return false; // Continua iterando
    }
    else {
      let j = 0;
      var aux2 = 0;
      while (j < centrosVersi.length) { // Comprueba el centro Iris-Versicolor
        aux2 += Math.pow(nuevoCentroVersi[j] - centrosVersi[j], 2);
        j++;
      }
      if (Math.sqrt(aux2) > tolerancia) {
        return false; // Continua iterando
      }
    }
    return true; // Se acabo iterars
  }

  const existExample = () => {
    if(newExample.length !== 0){
      let example = formatResult(newExample);
      resultKmeans(example);
    }  
    else alert("Antes tienes que introducir un ejemplo para clasificarlo")
  }

  const resultKmeans = (example) => { // Devuelve la clase resultante del metodo de K-Medias
    let resultFinal = "\n";
    let centrosFinal = formatCentersFinal(centrosObtenidos);
      var resultSetosa = 0;
      var resultVersiColor = 0;
      for (let j = 0; j < centrosFinal[0].length; j++) {
        resultSetosa += Math.pow(example[j] -  centrosFinal[0][j], 2);
      }
      for (let j = 0; j < centrosFinal[1].length; j++) {
        resultVersiColor += Math.pow(example[j] -  centrosFinal[1][j], 2);
      }
      if (resultSetosa < resultVersiColor) {
        resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
      }
      else {
        resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
      } 
      setResult([...result,  resultFinal]);  
    
  }



    return (
        <div className="main">
            <div className="panelKMeans">
                <div className="data">
                    <label id="datalabel">Datos</label>
                    {items()}
                    <label id="parameterslabel">Parámetros</label>
                    <div className="parameters1">
                        <label id="tolerancialabel">Tolerancia:</label>
                        <input type="text" id="tolerancia" name="tolerancia" size="32" value={tolerancia} onChange={(e)=>setField1(e)}required></input>
                    </div>
                    <div className="parameters2">
                        <label id="pesoExpolabel">Peso exponencial:</label>
                        <input type="text" id="pesoExponencial" name="pesoExponencial" size="32" value={pesoExponencial} onChange={(e)=>setField2(e)}required></input>
                    </div>
                    <div className="botonera">
                        <button className="btnP draw-border btnk" onClick={defaultValuesParams}>Por defecto</button>
                        <button className="btnP draw-border btnk" onClick={randomValuesParams}>Aleatorio</button>
                    </div>
                </div>
                <div className="secondaryPanel">
                    <div className="centros">
                        <div className="centrosIniPanel">
                            <label id="centrosLabel">Centros Iniciales</label>
                            <TextareaAutosize
                            rowsMax={10}
                            rows={5}
                            aria-label="maximum height"
                            placeholder="Data"
                            value={centrosIniciales}/>
                            <div className="botonera">
                                <button className="btnP draw-border btnk" onClick={defaultValuesBases} >Por defecto</button>
                                <button className="btnP draw-border btnk" onClick={randomValuesBases} >Aleatorio</button>
                            </div>
                        </div>
                        <div className="centrosObtPanel">
                            <label id="centrosObLabel">Centros Obtenidos</label>
                            <TextareaAutosize 
                            rowsMax={10}
                            rows={5}
                            aria-label="maximum height"
                            placeholder="Data"
                            value={centrosObtenidos}/>
                            <div className="botonera">
                                <button className="btnP draw-border btnk" onClick={execute_kmeans} >Ejecutar el Algoritmo</button>
                            </div>
                        </div>
                    </div>
                    <div className="organice">
                        <label id="newExampleLabel">Clasificar Nuevos Ejemplos</label>
                        <div className="examplesPanel">
                            <div className="addExample">
                                <TextareaAutosize 
                                rowsMax={50}
                                rows={10}
                                aria-label="maximum height"
                                placeholder="Data"
                                value={allExamples}/>
                                <div className="botonera">
                                    <form onSubmit={handleSubmit}>
                                        <input type="text" id="example" name="example" placeholder="Introduce el nuevo Ejemplo" size="50" required></input>
                                        <button className="btnP draw-border btnk">Añadir Ejemplo</button>
                                    </form>
                                </div>
                            </div>
                            <div className="clasificarExample">
                                <TextareaAutosize
                                rowsMax={50}
                                rows={10}
                                aria-label="maximum height"
                                placeholder="Data"
                                value={result}/>
                                <div className="botonera">
                                    <button className="btnP draw-border btnk" onClick={existExample}>Clasificar Ejemplo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <footer className="footer">
                <h3 id="footer-name">Desarollado por <strong>Roberto Torres Prensa</strong></h3>
                <p>Ingeniería del Conocimiento 2020-2021, Universidad Complutense de Madrid (UCM)</p>
            </footer>
        </div>
    );
}