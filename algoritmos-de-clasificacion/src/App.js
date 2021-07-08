import React, {useState} from "react";
import './styles/App.css';
import VerticalTabs from "./components/verticalTab"
import {DataTraining} from './components/dataTraining';

function App() {
  const [data, setData] = useState([]);

  return (
    <DataTraining.Provider value={{data, setData}}>
      <div className="App">
          <VerticalTabs></VerticalTabs>
      </div>
    </DataTraining.Provider>
  );
}

export default App;
