import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import QrScanner from 'react-qr-scanner';
import {Button} from "antd";
import {MoreOutlined} from "@ant-design/icons";
import TicketComponent from "../components/TicketComponent.tsx";

export default function MainShell() {
    const [data, setData] = useState<any>(null);
    const [show, setShow] = useState<boolean>(false);
    const handleScan = (result: any) => {
        if (result && !show) {
            console.log('QR Code:', result);
            setData(result);
            setShow(true);
        }
    };

    const handleError = (err: any) => {
        console.error('Error scanning QR:', err);
    };

    const previewStyle = {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    };

    return (
        <div className="relative h-screen w-screen">
            <div className="absolute top-0 left-0 w-full bg-white  py-4 px-4 z-10">
                <div className={'flex justify-between'}>
                    <h2 className={'text-lg'}>LEXPULSE</h2>
                    <Button type={'text'}><MoreOutlined/></Button>
                </div>
                <p>{data?.text}</p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <QrScanner
                    delay={300}
                    style={previewStyle}
                    facingMode={'rear'}
                    onError={handleError}
                    onScan={handleScan}
                />
            </div>
            {data && <TicketComponent show={show} setShow={setShow} id={data.text}/>}
        </div>
    );
}
