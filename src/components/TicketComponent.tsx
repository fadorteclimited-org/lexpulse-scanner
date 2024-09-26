import {Button, message, Modal, Typography} from "antd";
import { SetStateAction, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks.ts";
import {fetchTicket, scanTicket} from "../data/ticketsSlice.ts";

const { Title, Text } = Typography;

export default function TicketComponent({ show, setShow,setData, id }: {
    show: boolean;
    setShow: (value: SetStateAction<boolean>) => void;
    setData: (value: SetStateAction<any>) => void;
    id?: string;
}) {
    const { currentTicket, loading } = useAppSelector(state => state.tickets);
    const dispatch = useAppDispatch();

    useEffect(() => {
       if (id){
           dispatch(fetchTicket(id));
       }
    }, [id]);

    const handleConfirm = async () => {
        try {
           if (id){
               const result = await dispatch(scanTicket(id))
               if (result.meta.requestStatus === 'fulfilled'){
                   message.success('Scan successful!');
                   setShow(false);

               } else {
                   message.error(result.payload)
           }
               setData(undefined)
            }
        } catch (error) {
            message.error('Error scanning ticket');
            console.error(error);
        }
    }

    return (
        <Modal
            loading={loading}
            title={'Confirm Ticket'}
            open={show}
            onClose={() => setShow(false)}
            footer={null}
            onCancel={() => setShow(false)}
        >
            {currentTicket && (
                <div className={'px-4 py-2'}>
                    <Title level={4} className={'mb-2'}>Name</Title>
                    <Text className={'text-lg'}>
                        {currentTicket.attendeeId.firstName} {currentTicket.attendeeId.lastName}
                    </Text>

                    <Title level={4} className={'mt-4 mb-2'}>Booked Date</Title>
                    <Text className={'text-lg'}>
                        {new Date(currentTicket.createdAt).toDateString()}
                    </Text>


                    <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-white ${
                            (currentTicket.scanned ? 'bg-red-500' : 'bg-green-500')
                        }`}>
                            {currentTicket.scanned ? 'Scanned' : 'Not Scanned'}
                        </span>
                    </div>

                    <Title level={4} className={'mt-4 mb-2'}>Tickets</Title>
                    <table className={'min-w-full border-collapse border border-gray-300'}>
                        <tbody>
                        {currentTicket.ticketInfo.map((ticket, index) => (
                            <tr key={index} className={'border-b'}>
                                <td className={'p-2 border-r'}>{ticket.ticketType}</td>
                                <td className={'p-2'}>{ticket.numberOfTickets}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className={'flex justify-between mt-4'}>
                        <Button size={'large'} onClick={() => setShow(false)} danger={true}>Cancel</Button>
                        <Button size={'large'} type={'primary'} disabled={currentTicket.scanned} onClick={() => handleConfirm()}>Confirm</Button>
                    </div>

                    {/* Status Indicator */}
                    <div className={'mt-4'}>
                        {currentTicket.scanned ? (
                            <Text type="success">Status: Scanned</Text>
                        ) : (
                            <Text type="danger">Status: Not Scanned</Text>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
