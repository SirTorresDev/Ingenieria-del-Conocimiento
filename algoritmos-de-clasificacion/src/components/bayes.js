import React, {useState, useContext}from "react";
import "../styles/bayes.css"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {DataTraining} from './dataTraining';
import {basesIni, formatResult, formatMatrix} from "../javascripts/formatData"
import * as math from "mathjs"
export default function Bayes() {
    var irisSetosa = [];
    var irisVersicolor = [];
    var d = 4;

    const {data} = useContext(DataTraining);
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);
    const [matrixCov, setMatrixCov] = useState([]);
    const [matrixCovSetosa, setMatrixCovSetosa] = useState([]);
    const [matrixCovVersicolor, setMatrixCovVersicolor] = useState([]);
    const [mediaSetosa, setMediaSetosa] = useState([]);
    const [mediaVersiColor, setMediaVersiColor] = useState([]);
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

    const matrix = () =>{
        let array = [];
        for(let item in data){
            debugger
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
            rows={7}
            aria-label="maximum height"
            placeholder="Data"
            defaultValue=""
            value={matrixCov[item]}/>)
        } 
        return array;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewExample(e.target[0].value);
        setAllExamples([...allExamples, "\n" + (allExamples.length+1) + ") " +e.target[0].value])
    }

    //Algoritmo 

    const bayes = () => {
        debugger
        irisSetosa = data["Iris-setosa"]["values"];
        irisVersicolor = data["Iris-versicolor"]["values"];
        for (let i = 0; i < irisSetosa[0].length; i++) { // Suma de Iris-Setosa (Se suman a la vez dado que tienen el mismo numero de elementos)
            let auxSetosa = 0;
            let auxVersiColor = 0;
            for (let j = 0; j < irisSetosa.length; j++) {
                auxSetosa += parseFloat(irisSetosa[j][i]);
                auxVersiColor += parseFloat(irisVersicolor[j][i]);
            }
            mediaSetosa.push(auxSetosa * (1 / irisSetosa.length));
            mediaVersiColor.push(auxVersiColor * (1 / irisVersicolor.length));
        }
        console.log('Media de Iris-Setosa ----------')
        console.log(mediaSetosa);

        console.log('Media de Iris-VersiColor ----------')
        console.log(mediaVersiColor);
        let array = [];
        array.push(mediaSetosa);
        array.push(mediaVersiColor);
        array = basesIni(array);
        setCentrosObtenidos(array); 

        let cov1 = covarianceMatrix(mediaSetosa,1);
        let cov2 = covarianceMatrix(mediaVersiColor,2);

        console.log('Matrix de Iris-Setosa ----------')
        console.log(cov1);
        console.log('Matrix de Iris-VersiColor ----------')
        console.log(cov2);
        setMatrixCovSetosa(cov1);
        setMatrixCovVersicolor(cov2);
        cov1 = formatMatrix(cov1._data);
        cov2 = formatMatrix(cov2._data);

        let matrixCov = {
            "Iris-setosa" : cov1,
            "Iris-versicolor" : cov2
        }
        setMatrixCov(matrixCov);

    }
    const existExample = () => {
        if(newExample.length !== 0){
            let example = formatResult(newExample);
            resultBayes(example);
        }
        else alert("Antes tienes que introducir un ejemplo para clasificarlo")
    }
    const resultBayes = (example) => {
        //Esto deberia ser la funcion de calcular el resultado final
        let inv = math.inv(matrixCovSetosa);
        let deductXkm1 = [example[0]-mediaSetosa[0],example[1]-mediaSetosa[1], example[2]-mediaSetosa[2], example[3]-mediaSetosa[3]];
        let transp = math.transpose(deductXkm1);
        let aux = math.multiply(-1/2,transp);
        let mult = math.multiply(aux,inv);
        let resol = math.multiply(mult,deductXkm1);

        let inv2 = math.inv(matrixCovVersicolor);
        let deductXkm2 = [example[0]-mediaVersiColor[0],example[1]-mediaVersiColor[1], example[2]-mediaVersiColor[2], example[3]-mediaVersiColor[3]];
        let transp2 = math.transpose(deductXkm2);
        let aux2 = math.multiply(-1/2,transp2);
        let mult2 = math.multiply(aux2,inv2);
        let resol2 = math.multiply(mult2,deductXkm2);

        let exp = Math.exp(resol);
        let part1 =  1 /  ( Math.pow((2*Math.PI),d/2) * (Math.pow(math.det(matrixCovSetosa),1/2)) );
        let fxiw = part1 * exp;

        let exp2 = Math.exp(resol2);
        let fxiw2 = 1 /  ( Math.pow((2*Math.PI),d/2) * (Math.pow(math.det(matrixCovVersicolor),1/2)) ) * exp2;
        console.log(fxiw);
        let resultFinal = "\n";
        if(fxiw > fxiw2){
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
        }
        else {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
        }
        setResult([...result,  resultFinal]);
        console.log('El resultado es: ' + resultFinal);

    }

    const covarianceMatrix = (m,classs) => {
        let size;
        let ini = 0;
        let matrix = math.matrix([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
        let array;
        let long;
        if(classs === 1){
            long = data["Iris-setosa"].values.length;
            size = data["Iris-setosa"].values.length;
            array = data["Iris-setosa"].values;
        }
        else{
            long = data["Iris-versicolor"].values.length;
            size = data["Iris-versicolor"].values.length;
            array = data["Iris-versicolor"].values;
        }
        for(let i = ini; i < size; i++){
            const sample = array[i];
            let sample2 = math.matrix([[Number(sample[0]),Number(sample[1]),Number(sample[2]),Number(sample[3])]]);
            let m2 = math.matrix([[m[0],m[1],m[2],m[3]]]);
            let subtract = math.subtract(sample2,m2);
            let transp = math.transpose(subtract);
            let multiply = math.multiply(transp,subtract);
            matrix = math.add(matrix,multiply);
        }
        return math.divide(matrix, long);
    };

    return (
        <div className="main">  
            <div className="panelBayes">
                <div className="panel1">
                    <div className="matrix">
                        <label id="matrixLabel">Matrices de Covarianza</label>
                        <div className="matrixData">
                            {matrix()}
                        </div>
                        <div className="botoneraBayes">
                            <button className="btnP draw-border btnk" onClick={bayes}>Ejecutar el Algoritmo</button>
                        </div>
                    </div>
                    <div className="centrosObtPanelBayes">
                        <label id="centrosObLabel">Centros Obtenidos</label>
                        <TextareaAutosize 
                        id="textAreaCentros"
                        rowsMax={10}
                        rows={7}
                        aria-label="maximum height"
                        placeholder="Data"
                        value={centrosObtenidos}/>
                    </div>
                </div>
                <div className="panel2">
                    <div className="data">
                        <label id="datalabel">Datos</label>
                        {items()}
                    </div>
                    <div className="organiceBayes">
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
                                        <input type="text" id="name" name="name" placeholder="Introduce el nuevo Ejemplo" size="50" required></input>
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