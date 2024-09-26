import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import QrScanner from 'react-qr-scanner';
import { Button } from "antd";
import TicketComponent from "../components/TicketComponent.tsx";

export default function MainShell() {
    const [data, setData] = useState<any>(null);
    const [show, setShow] = useState<boolean>(false);
    const [cameraId, setCameraId] = useState<string | null>(null);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

    // Scan result handler
    const handleScan = (result: any) => {
        if (result && !show) {
            console.log('QR Code:', result);
            setData(result);
            setShow(true);
        }
    };

    // Error handler
    const handleError = (err: any) => {
        console.error('Error scanning QR:', err);
    };

    // Request camera access and fetch the list of available cameras
    const getCameras = async () => {
        try {
            // Request permission to use the camera
            await navigator.mediaDevices.getUserMedia({ video: true });

            // Enumerate available video input devices (cameras)
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);

            // Set to the first available camera initially
            if (videoDevices.length > 0 && !cameraId) {
                setCameraId(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error("Error accessing cameras: ", error);
            alert("Please allow camera access to use the QR scanner.");
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

    // Preview style for the QR scanner
    const previewStyle = {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    };

    // Fetch available cameras on component mount
    useEffect(() => {
        getCameras();
    }, []);

    return (
        <div className="relative h-screen w-screen">
            <div className="absolute top-0 left-0 w-full bg-white py-4 px-4 z-10">
                <div className={'flex justify-between'}>
                    <h2 className={'text-lg'}>LEXPULSE</h2>
                    <Button type={'text'} onClick={switchCamera}>
                        Switch Camera
                    </Button>
                </div>
                <p>{data?.text}</p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-0">
                {cameraId && (
                    <QrScanner
                        delay={300}
                        style={previewStyle}
                        constraints={{
                            video: { deviceId: cameraId } // Pass the selected camera's deviceId
                        }}
                        onError={handleError}
                        onScan={handleScan}
                    />
                )}
            </div>
            {data && <TicketComponent show={show} setShow={setShow} id={data.text} />}
        </div>
    );
}
