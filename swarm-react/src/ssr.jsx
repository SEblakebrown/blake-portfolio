import React from "react";
import {renderToString} from "react-dom/server";
import Swarm from "./Swarm.jsx";
export function renderPage(){return renderToString(<Swarm/>);}
