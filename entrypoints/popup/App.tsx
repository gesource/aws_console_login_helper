import './App.css'
import {HashRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import MainPage from './pages/MainPage.tsx';
import AddPage from './pages/AddPage.tsx';
import Layout from './common/Layout.tsx';
import SettingPage from "./pages/SettingPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Navigate to="/index.html"/>}/>
                    <Route path="index.html" element={<MainPage/>}/>
                    <Route path="/add" element={<AddPage/>}/>
                    <Route path="/edit/:id" element={<AddPage/>}/>
                    <Route path="/setting" element={<SettingPage/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
