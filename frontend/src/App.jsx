
import './App.css'
import { BrowserRouter as Router , Route, Routes, } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
function App() {
 

  return (
    <Router>
     
         <Routes>
        <Route path="/" element={<Home/>}>
        </Route>
        <Route path="/footer" element={<Footer/>}>
        </Route>
        
        
      
      </Routes>
    </Router>
  )
}

export default App
