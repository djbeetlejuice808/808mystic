import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import classes from './ClientSignIn.module.css';
import ClientHeader from '../../Components/ClientHeader/ClientHeader';
import { Notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function ClientSignIn() {
    const [loading, setLoading] = useState(false); 
    const [countdown, setCountdown] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:4000/api/v1/users/signin', {
                username: values.username,
                password: values.password,
            },{ withCredentials: true });
            setSuccess(true);
            
            Notifications.show({
                title: 'Thông báo',
                message: response.data.message,
            })
            setCountdown(3);
        } catch (err) {
            const errorMessage =  err.response && err.response.data.error 
                                ?  err.response.data.error 
                                : 'Đăng nhập thất bại, vui lòng thử lại!';
            Notifications.show({
                color: 'red',
                title: 'Thông báo',
                message: errorMessage,
            })
        } finally {
            setLoading(false); 
        }
    }

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            accepted: false,
        },

        validate: {
            username: (value) => value.trim().length === 0 ? 'Tên tài khoản không được để trống' : null,
            password: (value) => value.length < 2 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null,
        },
    });

    useEffect(() => {
        let timer;
        if (countdown !== null && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            navigate('/homepage');
        }
        return () => clearInterval(timer);
    }, [countdown, navigate]);
    return (
        <>
            <ClientHeader />
            <Container size={420} my={40}>
                <Title ta="center" className={classes.title}>
                    Chào mừng quay trở lại!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Bạn đã có tài khoản chưa?{' '}
                    <Anchor size="sm" component="button">
                        <Link to="/signup">Tạo tài khoản</Link>
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            label="Tài khoản"
                            placeholder="Nhập tên tài khoản"
                            error="Invalid name"
                            {...form.getInputProps('username')}
                        />
                        <PasswordInput
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            mt="md"
                            error="Invalid name"
                            {...form.getInputProps('password')}
                        />
                        <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" {...form.getInputProps('accepted', { type: 'checkbox' })} />
                            <Anchor component="button" size="sm">
                                Quên mật khẩu
                            </Anchor>
                        </Group>
                        <Button type="submit" fullWidth mt="xl" loading={loading} >
                            {   loading ? 'Đang đăng nhập...' : 
                                success ? `Chuyển trang sau ${countdown}s` : 
                                'Đăng nhập'
                            }
                        </Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
