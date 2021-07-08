import React, {useState, useRef} from "react";
import "../styles/home.css"
import gif from "../images/source.gif"
import {DataTraining} from './dataTraining';  

export default function Home() {

    const refData = useRef();

    const {setData} = React.useContext(DataTraining);
    const [file, setFile] = useState([]);

    const handleSubmitData = (e) =>{
        e.preventDefault();
        let file = refData.current.files[0];
        if (file.type === 'text/plain') {
          setFile(file);
          getFileContentsData(file);
     
  
        } else {
          alert('¡He dicho archivo de texto!');
        }
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

    const transformData  = (arrayresult) => {
        console.log("Se van a leer los datos");
            console.log("Se ha seleccionado el archivo", file);
            var lines = arrayresult.split("\n").filter(Boolean);
            var array = {};
            var object = lines.map(line => {
                var array = line.toString().split(",");
                array = array.toString().split("\r");
                return array.filter(element => element);
            });
            for (let str of object) {
              let title = str[0].split(',');
              array[title[title.length - 1]] = {
                  values: []
              }
            }
            for (let str of object) {
              let temp = [];
              let numbers = str[0].split(',');
              for (let i = 0; i < numbers.length - 1; ++i) {
                  temp.push(numbers[i] );
              }
              array[numbers[numbers.length - 1]].values.push(temp)
            }
            setData(array);
      }
    
    return (
        <div className="home">  
            <img className="firstPanel" src={gif} alt="" /> 
            <form className="secondPanel" onSubmit={handleSubmitData}>
              <label className="labelTraining">Selecciona fichero de entrenamiento</label>
              <input type="file" className="btnP draw-border btn" placeholder="Selecciona fichero de entrenamiento" size="32"  ref={refData}required></input>
              <button className="btnPre draw-border btn">Cargar</button>
            </form>
        </div>
    );
    
}