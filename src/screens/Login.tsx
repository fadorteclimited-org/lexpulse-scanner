import { Form, Input, Button, Typography, message } from 'antd';


import { RootState } from '../store';
import {loginScanner} from "../data/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

export default function Login() {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state: RootState) => state.auth.loading);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const result = await dispatch(loginScanner(values));
            if (result.meta.requestStatus === 'fulfilled'){
                navigate('/')
                message.success('Login successful!');
            } else {
                message.error('Login failed. Please check your credentials.');
            }


        } catch (error) {
            message.error('Login failed. Please check your credentials.');
            console.error(error);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div style={{ width: '300px' }}>
                <Title level={3}>Login</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ email: '', password: '' }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}