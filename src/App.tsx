import './App.css'
import { Route, Routes } from "react-router-dom";
import MainShell from "./screens/Home.tsx";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { darkColors, primaryColor } from "../colors.ts";

function App() {
    const [isDarkMode] = useState<boolean>(false);
    const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null); // Store camera permission state

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

    // Function to request camera access once
    const requestCameraAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraAccess(true); // Camera access granted
        } catch (error) {
            setHasCameraAccess(false); // Camera access denied or failed
        }
    };

    // Request camera access on app load, but only once
    useEffect(() => {
        requestCameraAccess();
    }, []);

    return (
        <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Routes>
                {/* Pass the camera access status to the MainShell component */}
                <Route path={'/'} element={<MainShell hasCameraAccess={hasCameraAccess} />} />
            </Routes>
        </ConfigProvider>
    )
}

export default App;
