import './App.css';
import axios from "axios";
import React, {useEffect} from 'react';

const server_ip = 'app-load-balancer-313513181.us-east-1.elb.amazonaws.com'

function App() {

    // Assign correct styling for current light states on page (re)load
    useEffect(() => {
        axios.get(`http://${server_ip}:4000/get-status`).then((res) => {
            console.log(res.data)
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i] && res.data[i].light_on !== undefined) {
                    console.log(res.data[i].light_on);
                    var lightState = res.data[i].light_on;
                    const buttonElement = document.getElementById(res.data[i].id);

                    if (lightState) {
                        buttonElement.classList.add("light-on");
                        buttonElement.classList.remove("light-off");
                    }
                    else {
                        buttonElement.classList.add("light-off");
                        buttonElement.classList.remove("light-on");
                    }
                } else {
                    console.log("Data for index " + i + " is undefined or does not have 'light_on' property.");
                }
            }
        }); 
    }, []);    

    // Toggles light on or off by light id
    function toggle(id) {
        axios.get(`http://${server_ip}:4000/toggle/` + id).then((res) => {
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

    // Toggles all lights on
    function masterOn() {
        axios.get(`http://${server_ip}:4000/toggle/master/on`).then((res) => {
            for (let i = 1; i <= res.data; i++){
                const buttonElement = document.getElementById(i);
                buttonElement.classList.add("light-on");
                buttonElement.classList.remove("light-off");
            }
        }); 
    };

    // Toggles all lights off
    function masterOff() {
        axios.get(`http://${server_ip}:4000/toggle/master/off`).then((res) => {
            for (let i = 1; i <= res.data; i++){
                const buttonElement = document.getElementById(i);
                buttonElement.classList.add("light-off");
                buttonElement.classList.remove("light-on");
            }
        }); 
    };

    return (
        <div className="App">
            <h1 style={{textAlign:"center"}}>Virtual Switch Board</h1>
              <div className='app-container'>
              <button className='master-swtich master-on' style={{width:"100px"}} onClick={() => masterOn()}>Master ON</button>
              <button className='master-swtich master-off' style={{width:"100px"}} onClick={() => masterOff()}>Master OFF</button>
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
