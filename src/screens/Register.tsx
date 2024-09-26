import { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";

import { processInvite, activateScanner, selectCurrentUser } from "../data/authSlice";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";

const { Title } = Typography;

export default function RegisterScreen() {
    const [searchParams] = useSearchParams();
    const oob = searchParams.get("oob");
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const loading = useAppSelector((state) => state.auth.loading);
    const navigate = useNavigate();

    useEffect(() => {
        if (oob) {
            dispatch(processInvite(oob));
        }
    }, [oob, dispatch]);

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        if (!user) return;
        if (values.password !== values.confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }

        try {
           const result = await dispatch(
                activateScanner({
                    email: user.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                })
            );
           if (result.meta.requestStatus === 'fulfilled') {
               message.success("Password set successfully!");
               navigate('/login');
           } else {
               message.error(result.payload as string);
           }

        } catch (error) {
            message.error("Failed to set password.");
            console.error(error);
        }
    };

    if (user) {
        return (
            <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
                <Title level={3}>Register for {user.email}</Title>
                <Form layout="vertical" onFinish={handleSubmit} initialValues={{ email: user.email }}>
                    <Form.Item label={'Email'} name="email">
                        <Input disabled={true} readOnly={true} placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]} hasFeedback>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The two passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Set Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
}