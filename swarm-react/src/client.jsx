import React,{useEffect} from "react";
import {hydrateRoot} from "react-dom/client";
import Swarm from "./Swarm.jsx";
import {startSwarmEngine} from "./engine.js";
function Client(){
 useEffect(()=>startSwarmEngine(),[]);
 return <Swarm/>;
}
const root=document.getElementById("swarm-root");
if(root)hydrateRoot(root,<Client/>,{onRecoverableError:error=>console.warn("Swarm hydration:",error)});
