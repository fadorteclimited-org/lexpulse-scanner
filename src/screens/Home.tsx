import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import QrScanner from 'react-qr-scanner';
import { Button } from "antd";
import TicketComponent from "../components/TicketComponent.tsx";
import {CameraOutlined} from "@ant-design/icons";
import {useAppSelector} from "../hooks/hooks.ts";
import {selectCurrentUser} from "../data/authSlice.ts";

export default function MainShell({ hasCameraAccess }: { hasCameraAccess: boolean | null }) {
    const [data, setData] = useState<any>(null);
    const [show, setShow] = useState<boolean>(false);
    const [cameraId, setCameraId] = useState<string | null>(null);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [scanning, setScanning] = useState<boolean>(true); // Control if scanning should continue
    const user = useAppSelector(selectCurrentUser);
    // Handle QR code scanning
    const handleScan = (result: any) => {
        if (result && !show && scanning) {
            console.log('QR Code:', result);
            setData(result);  // Store the scanned data
            setShow(true);    // Open the modal
            setScanning(false); // Pause scanning when modal is shown
        }
    };

    // Handle scanning errors
    const handleError = (err: any) => {
        console.error('Error scanning QR:', err);
    };

    // Get available cameras
    const getCameras = async () => {
        if (hasCameraAccess) {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setAvailableCameras(videoDevices);
                if (videoDevices.length > 0 && !cameraId) {
                    setCameraId(videoDevices[0].deviceId); // Set the first available camera
                }
            } catch (error) {
                console.error("Error fetching cameras: ", error);
            }
        }
    };

    // Switch between available cameras
    const switchCamera = () => {
        if (availableCameras.length > 1) {
            const currentIndex = availableCameras.findIndex(cam => cam.deviceId === cameraId);
            const nextCamera = availableCameras[(currentIndex + 1) % availableCameras.length];
            setCameraId(nextCamera.deviceId);
        }
    };

    // Fetch the available cameras when camera access is available
    useEffect(() => {
        if (hasCameraAccess !== null) {
            getCameras();
        }
    }, [hasCameraAccess]);

    // Re-enable the scanner once the modal is closed
    useEffect(() => {
        if (!show) {
            setScanning(true);  // Resume scanning when modal is closed
        }
    }, [show]);

    const previewStyle = {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    };

    return (
        <div className="relative h-screen w-screen">
            {hasCameraAccess === false ? (
                <div className="flex justify-center items-center h-full">
                    <p>Camera access is required to use the QR scanner. Please enable camera access.</p>
                </div>
            ) : (
                <>
                    <div className="absolute top-0 left-0 w-full bg-primary text-white py-4 px-4 z-10">
                        <div className={'flex justify-between'}>
                            <h2 className={'text-lg font-semibold'}>LEXPULSE</h2>
                            <Button className={'text-white'} type={'text'} icon={<CameraOutlined/>} onClick={switchCamera}>
                                Switch Camera
                            </Button>
                        </div>
                        <h3>{user?.eventId}</h3>
                    </div>

                    {/* QR scanner should only run when the modal is closed */}
                    {scanning && (
                        <div className="absolute top-0 left-0 w-full h-full z-0">
                            {cameraId && (
                                <QrScanner
                                    delay={300}
                                    style={previewStyle}
                                    constraints={{
                                        video: { deviceId: cameraId }
                                    }}
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                            )}
                        </div>
                    )}

                    {/* Show the modal for ticket info */}
                    {data && (
                        <TicketComponent
                            show={show}
                            setShow={setShow}
                            setData={setData}
                            id={data.text}
                        />
                    )}
                </>
            )}
        </div>
    );
}
