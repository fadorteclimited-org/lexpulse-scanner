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

    // Get list of available cameras
    const getCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log(videoDevices)
            setAvailableCameras(videoDevices);
            if (videoDevices.length > 0 && !cameraId) {
                setCameraId(videoDevices[0].deviceId); // Set to the first available camera initially
            }
        } catch (error) {
            console.error("Error fetching cameras: ", error);
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
