import * as THREE from "three";
import React, { useState, useEffect, Suspense } from "react";
import { OrbitControls } from "drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import logo from "./haapi.svg"
import LoadingScreen from 'react-loading-screen'




let FrontRightLatch;
let RearRightLatch;
let FrontLeftLatch;
let RearLeftLatch;
let trunkLatchStatus;



function reqUnlock () {
  
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqUnlock);
  oReq.open("GET", "http://live.canbushack.com/command/Unlock");
  oReq.send();
  

}

function reqLock () {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqLock);
  oReq.open("GET", "http://live.canbushack.com/command/Lock");
  oReq.send();

}


function reqStart () {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqStart);
  oReq.open("GET", "http://live.canbushack.com/command/Start Vehicle");
  oReq.send();

}

function reqTrunk () {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqTrunk);
  oReq.open("GET", "http://live.canbushack.com/command/Trunk");
  oReq.send();

}


function Tesla() {
  const gltf = useLoader(GLTFLoader, "/tesla-w-animations.gltf");
  gltf.scene.scale.set(0.005, 0.005, 0.005)
  
  let mixer
  let animations
  let partA // FRONT RIGHT
  let partB // REAR RIGHT 
  let partC // FRONT LEFT 
  let partD  // REAR LEFT
  let partE // TRUNK 
  


        animations = gltf.animations
        mixer = new THREE.AnimationMixer(gltf.scene);
        // console.log(animations)
       
    

    useFrame((state, delta) => {

      const clipA = animations[ 4 ] // FRONT RIGHT 
      const clipB = animations[ 5 ] // REAR RIGHT 
      const clipC = animations[ 2 ] // FRONT RIGHT 
      const clipD = animations[ 3 ] // REAR RIGHT 
      const clipE = animations[ 1 ] // TRUNK
      

      partA = mixer.clipAction(clipA)
      if(FrontRightLatch === "LATCH_OPENED"){
        partA.paused = false;
        partA.timeScale = 1;
        partA.setLoop(THREE.LoopOnce);
        partA.clampWhenFinished = true;
        partA.play()
      }
      else if(FrontRightLatch === "LATCH_CLOSED"){
        partA.paused = false;
        partA.timeScale = -1;
        partA.setLoop(THREE.LoopOnce);
        partA.clampWhenFinished = true;
        partA.play()
      }

      partB = mixer.clipAction(clipB)
      if(RearRightLatch === "LATCH_OPENED"){
        partB.paused = false;
        partB.timeScale = -1;
        partB.setLoop(THREE.LoopOnce);
        partB.clampWhenFinished = true;
        partB.play()
      }
      else if(RearRightLatch === "LATCH_CLOSED"){
        partB.paused = false;
        partB.timeScale = -1;
        partB.setLoop(THREE.LoopOnce);
        partB.clampWhenFinished = true;
        partB.play()
      }

      partC = mixer.clipAction(clipC)
      if(FrontLeftLatch === "LATCH_OPENED"){
        partC.paused = false;
        partC.timeScale = 1;
        partC.setLoop(THREE.LoopOnce);
        partC.clampWhenFinished = true;
        partC.play()
      }
      else if(FrontLeftLatch === "LATCH_CLOSED"){
        partC.paused = false;
        partC.timeScale = -1;
        partC.setLoop(THREE.LoopOnce);
        partC.clampWhenFinished = true;
        partC.play()
      }

      partD = mixer.clipAction(clipD)
      if(RearLeftLatch === "LATCH_OPENED"){
        partD.paused = false;
        partD.timeScale = 1;
        partD.setLoop(THREE.LoopOnce);
        partD.clampWhenFinished = true;
        partD.play()
      }
      else if(RearLeftLatch === "LATCH_CLOSED"){
        partD.paused = false;
        partD.timeScale = -1;
        partD.setLoop(THREE.LoopOnce);
        partD.clampWhenFinished = true;
        partD.play()
      }

      partE = mixer.clipAction(clipE)
      if(trunkLatchStatus === "LATCH_OPENED"){
        partE.paused = false;
        partE.timeScale = 1;
        partE.setLoop(THREE.LoopOnce);
        partE.clampWhenFinished = true;
        partE.play()
      }
      else if(trunkLatchStatus === "LATCH_CLOSED"){
        partE.paused = false;
        partE.timeScale = -1;
        partE.setLoop(THREE.LoopOnce);
        partE.clampWhenFinished = true;
        partE.play()
      }
      

      //Update
        mixer.update(delta)
    })

  return <primitive position ={[0, 0, 0]} object={gltf.scene} />;
}


function Scene() {
  return (
    <>
      <ambientLight />
      <pointLight intensity={0.6} position={[0, 10, 4]} />
      <Suspense fallback={null}>
       
        <Tesla />
        
      </Suspense>
      <OrbitControls autoRotate = {[true]} />
      

      
    </>
  );
}




  





function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      // console.log('This will run every second!');
   
    

    Promise.all([
      fetch('http://live.canbushack.com/db_get/259/'), // Right Side Doors
      fetch('http://live.canbushack.com/db_get/258/') // Left Side Doors

      
      
  ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
          return response.json() ;
          
          
      }))
  
      
  })

  
  
  .then(function (data) {
    FrontRightLatch = data[0]['VCRIGHT_frontLatchStatus']['enumerated_value']
    RearRightLatch = data[0]['VCRIGHT_rearLatchStatus']['enumerated_value']
    FrontLeftLatch = data[1]['VCLEFT_frontLatchStatus']['enumerated_value']
    RearLeftLatch = data[1]['VCLEFT_rearLatchStatus']['enumerated_value']
    trunkLatchStatus = data[0]['VCRIGHT_trunkLatchStatus']['enumerated_value']
    // console.log(data)
    
  })



    .catch((error) => {
    console.error("Error fetching data: ", error);
    setError(error);
    })
    .finally(() => {
    setLoading(false);
    })}, 1000);
  
    return () => clearInterval(interval);
    }, []);
    if (loading) return <LoadingScreen
    loading={loading}
    bgColor='#f1f1f1'
    spinnerColor='#9ee5f8'
    textColor='#676767'
    text='Haapi is connecting to our servers'
  >
    {/* <div style={{ textAlign: 'center' }}>
      <h1>react-screen-loading</h1>
      <p>Example of usage loading-screen, based on React</p>
      
    </div> */}
  </LoadingScreen>;

    if (error) return <LoadingScreen
    loading={loading}
    bgColor='#f1f1f1'
    spinnerColor='#9ee5f8'
    textColor='#676767'
    text='Failed to connect to server'
  >
    {/* <div style={{ textAlign: 'center' }}>
      <h1>react-screen-loading</h1>
      <p>Example of usage loading-screen, based on React</p>
      
    </div> */}
  </LoadingScreen>;

    

 return (

<>
    
    
    <img src={logo} className="App-logo" alt="logo" />

    <div id="container-md">
    <button  className ="btn btn-primary" onClick={reqUnlock}>Unlock</button>
    <button  className ="btn btn-primary" onClick={reqLock}>Lock</button>
    <button  className ="btn btn-primary" onClick={reqStart}>Keyless Drive</button>
    <button  className ="btn btn-primary" onClick={reqTrunk}>Trunk</button>

  </div>
      <Canvas 
       camera={{
          position: [-5.10923594025578253, 2.3585518996952866, -5.686206208293889],
          near: 0.5,
          far: 2000,
          fov: 25,
          autoRotate: true
        }}
        >
   
   
        <Scene />
      </Canvas>
      
    
     </>
  );
}

export default App;
