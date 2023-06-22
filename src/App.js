
import { Routes,Route,BrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import Service from './routes/Service';
import About from './routes/About';
import Contact from './routes/Contact';
import DragDrop from './routes/drag';
import "./App.css"
import {HashLink as Link} from "react-router-hash-link";
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/DragDrop" element={<DragDrop/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
