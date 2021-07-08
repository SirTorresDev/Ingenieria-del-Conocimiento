import React, {useState, useContext} from "react";
import "../styles/lloyd.css"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {DataTraining} from './dataTraining';
import {basesIni, roundDecimals, formatResult, formatCentersFinal} from "../javascripts/formatData"
import * as math from "mathjs"


export default function Lloyd() {
    let basesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let OldbasesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let defaultTolerancia = Math.pow(10, -10);
    let defaultPesoExponencial = 2;
    let numMaxIter = 10;
    let rLearn = 0.1;
    let b = 2;



    const {data} = useContext(DataTraining);
    const [tolerancia, setTolerancia] = useState(defaultTolerancia);
    const [pesoExponencial, setPesoExponencial] = useState(defaultPesoExponencial);
    const [centrosIniciales, setCentrosIniciales] = useState(basesIni(basesIniciales));
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);
    const [centrosObtenidosNofix, setcentrosObtenidosNofix] = useState([]);
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
        debugger
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


    //Algoritmo
    const existExample = () => {
        debugger
        if(newExample.length !== 0){
          let example = formatResult(newExample);
          resultLloyd(example);
        }  
        else alert("Antes tienes que introducir un ejemplo para clasificarlo")
    }

    const calculateDLloyd = (centers, i, sample) => {
        let dij = 0;
        let centroid = centers[i];
        let base = sample[0] - centroid[0];
        dij += Math.pow(base, b);
        base = sample[1] - centroid[1];
        dij += Math.pow(base, b);
        base = sample[2] - centroid[2];
        dij += Math.pow(base, b);
        base = sample[3] - centroid[3];
        dij += Math.pow(base, b);
        return Math.sqrt(dij);
    };

    const resultLloyd = (example) => {
        let Pvixj1 = 0;
        let Pvixj2 = 0;
        let dij1 = calculateDLloyd(centrosObtenidosNofix, 0,example);
        let dij2 = calculateDLloyd(centrosObtenidosNofix, 1,example);
        let num1 = (1 / dij1);
        let num2 = (1 / dij2);
        let den = num1 + num2;
        Pvixj1 = num1 / den;
        Pvixj2 = num2 / den;
        let resultFinal = "\n";
        if(Pvixj1 > Pvixj2){
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
        }
        else {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
        }
        setResult([...result,  resultFinal]);
        console.log('El resultado es: ' + resultFinal);
    };
    
    const lloyd = () => {
        let stop = false;
        let it = 1;
        let v1euc;
        let v2euc;
        while(!stop && it <= numMaxIter){
            updateLloydCentroids();
            v1euc = math.subtract(basesIniciales[0],OldbasesIniciales[0]);
            v2euc =  math.subtract(basesIniciales[1],OldbasesIniciales[1]);

            if( v1euc < defaultTolerancia && v2euc < defaultTolerancia)
                stop = true;
                //OldbasesIniciales = basesIniciales.slice(); //Array CLONE!!! Easy
            it++;
        }
        let newValue = [];
        debugger
        newValue.push(basesIniciales[0]);
        newValue.push(basesIniciales[1]);
        setcentrosObtenidosNofix(newValue);
        newValue = basesIni(newValue); //Formateo las bases para mostrarlas en la vista
        setCentrosObtenidos(newValue);
    }
    const updateLloydCentroids = () => {
        for(let element in data){
            for (let j = 0; j < data[element].values.length; j++) {
                let v1 = basesIniciales[0];
                let v2 = basesIniciales[1];
                const sample = data[element].values[j];
                let sampleMatrix = math.matrix([[Number(sample[0])],[Number(sample[1])],[Number(sample[2])],[Number(sample[3])]]);
    
                let d1 = calculateDLloyd(basesIniciales, 0,sample);
                let d2 = calculateDLloyd(basesIniciales, 1,sample);
    
                if(d1 < d2){ // se actualiza c1
                    let sol = 0;
                    let c1 = math.matrix([[v1[0]],[v1[1]],[v1[2]],[v1[3]]]); 
                    let subtractAndkMultiply = math.multiply(math.subtract(sampleMatrix,c1),rLearn);
                    sol = math.add(c1,subtractAndkMultiply);
                    basesIniciales[0] = [sol.get([0, 0]),sol.get([1, 0]),sol.get([2, 0]),sol.get([3, 0])];
                }
                else{// se actualiza c2
                    let sol2 = 0;
                    let c2 = math.matrix([[v2[0]],[v2[1]],[v2[2]],[v2[3]]]);
                    let subtractAndkMultiply = math.multiply(math.subtract(sampleMatrix,c2),rLearn);
                    sol2 = math.add(c2,subtractAndkMultiply);
                    basesIniciales[1] = [sol2.get([0, 0]),sol2.get([1, 0]),sol2.get([2, 0]),sol2.get([3, 0])];
                }
            }
        }
};


    return (
        <div className="main">
            <div className="panelLloyd">
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
                        <input type="text" id="pesoExponencial" name="pesoExponencial" size="32" value={pesoExponencial}  onChange={(e)=>setField2(e)}required></input>
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
                                <button className="btnP draw-border btnk" onClick={lloyd} >Ejecutar el Algoritmo</button>
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
                                 <form onSubmit={handleSubmit}>
                                 <input type="text" id="example" name="example" placeholder="Introduce el nuevo Ejemplo" size="50" required></input>
                                    <button className="btnP draw-border btnk">Añadir Ejemplo</button>
                                </form>
                            </div>
                            <div className="clasificarExample">
                                <TextareaAutosize 
                                rowsMax={50}
                                rows={10}
                                aria-label="maximum height"
                                placeholder="Data"
                                value={result}/>
                                <div className="botonera">
                                    <button className="btnP draw-border btnk" onClick={existExample} >Clasificar Ejemplo</button>
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