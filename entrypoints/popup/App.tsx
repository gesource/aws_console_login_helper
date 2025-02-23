import './App.css'
import {usePersist} from './hooks/usePersist.ts';
import Account from './models/Account.ts';
import {HashRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import MainPage from './pages/MainPage.tsx';
import AddPage from './pages/AddPage.tsx';
import Layout from './common/Layout.tsx';
import SettingPage from "./pages/SettingPage.tsx";

function App() {
    const STORAGE_KEY = "accounts";
    const [accounts, setAccounts] = usePersist<Account[]>(STORAGE_KEY, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Navigate to="/index.html"/>}/>
                        <Route path="index.html" element={<MainPage accounts={accounts} setAccounts={setAccounts}/>}/>
                        <Route path="/add" element={<AddPage accounts={accounts} setAccounts={setAccounts}/>}/>
                        <Route path="/edit/:id" element={<AddPage accounts={accounts} setAccounts={setAccounts}/>}/>
                        <Route path="/setting" element={<SettingPage accounts={accounts} setAccounts={setAccounts}/>}/>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
