import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import MainShell from "./screens/Home.tsx";
import Login from "./screens/Login.tsx";
import Register from "./screens/Register.tsx"; // Assuming Register component is in this location
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { darkColors, primaryColor } from "../colors.ts";
import { useSelector } from 'react-redux';
import { RootState } from './store'; // Assuming the store is correctly set up

function App() {
    const [isDarkMode] = useState<boolean>(false);
    const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null); // Store camera permission state
    const token = useSelector((state: RootState) => state.auth.token); // Get the auth token from the Redux store

    const lightTheme = {
        token: {
            colorPrimary: primaryColor['500'],
            colorTextBase: '#000000',
            colorBgBase: '#ffffff',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
            Menu: {
                darkItemBg: darkColors.dark,
            },
            Select: {
                clearBg: "rgba(255,255,255,0)",
                selectorBg: "rgba(255,255,255,0)",
            },
        },
    };

    const darkTheme = {
        token: {
            colorPrimary: primaryColor['700'],
            colorTextBase: '#E4E4E4',
            colorBgBase: darkColors.dark,
            colorBgContainer: '#1F1F1F',
            colorInfo: primaryColor['500'],
        },
        components: {
            Layout: {
                siderBg: darkColors.dark,
            },
        },
    };

    // Function to request camera access
    const requestCameraAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraAccess(true);
        } catch (error) {
            setHasCameraAccess(false);
        }
    };


    useEffect(() => {
        if (token) {
            requestCameraAccess();
        }
    }, [token]);

    return (
        <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Routes>
                <Route
                    path="/"
                    element={
                        token ? <MainShell hasCameraAccess={hasCameraAccess} /> : <Navigate to="/login" />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </ConfigProvider>
    );
}

export default App;