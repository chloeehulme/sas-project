import './App.css';
import axios from "axios";
import React from 'react';

function App() {

    function toggle(id) {
        console.log("clicked: " + id)
        axios.get('http://localhost:4000/toggle/' + id).then((res) => {
            var lightState = res.data[0].light_on;
            const buttonElement = document.getElementById(id);

            if (lightState) {
                buttonElement.classList.add("light-on");
                buttonElement.classList.remove("light-off");
            } else {
                buttonElement.classList.add("light-off");
                buttonElement.classList.remove("light-on");
            }
        });

        
    };

    return (
        <div className="App">
              <div className='app-container'>
              <button className='master-swtich' style={{width:"100px"}} onClick={() => toggle(0)}>Master Switch</button>
                    <div className='first-half'>
                        <button id='1' onClick={() => toggle(1)}>1</button>
                        <button id='3' onClick={() => toggle(3)}>3</button>
                        <button id='5' onClick={() => toggle(5)}>5</button>
                        <button id='7' onClick={() => toggle(7)}>7</button>
                        <button id='9' onClick={() => toggle(9)}>9</button>
                    </div>
                    <div className='second-half'>
                        <button id='2' onClick={() => toggle(2)}>2</button>
                        <button id='4' onClick={() => toggle(4)}>4</button>
                        <button id='6' onClick={() => toggle(6)}>6</button>
                        <button id='8' onClick={() => toggle(8)}>8</button>
                        <button id='10' onClick={() => toggle(10)}>10</button>
                    </div>
              </div>
        </div>
    );
}

export default App;
