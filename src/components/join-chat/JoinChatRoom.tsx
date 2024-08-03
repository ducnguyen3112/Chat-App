import { Button, Flex, Form, Input, message } from 'antd';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import './JoinChatRoom.css';
import { db } from '../../config/firebase';

interface JoinChatRoomProps {
    onJoin: (username: string) => void;
}

const JoinChatRoom: React.FC<JoinChatRoomProps> = ({onJoin}) => {
    const [username, setUsername] = useState('');

    const handleJoin = async () => {
        if (username.trim()) {
            const userRef = doc(db, 'users', username);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                message.error(`User with the name "${ username }" already exists.`);
            } else {
                await setDoc(userRef, {
                    name: username,
                    createdDate: Date.now(),
                });
                localStorage.setItem('username', username.trim());
                onJoin(username.trim());
            }
        } else {
            message.error('Please enter a valid username');
        }
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await handleJoin();
        }
    };

    return (
        <Form className={ 'join-chat-room-layout' }>
            <Flex gap={ 10 }>
                <Form.Item label="Enter your name to join the chat room">
                    <Input
                        value={ username }
                        onChange={ (e) => setUsername(e.target.value) }
                        placeholder="Your name"
                        onPressEnter={ handleKeyPress }
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={ handleJoin }>
                        Join Chat Room
                    </Button>
                </Form.Item>
            </Flex>

        </Form>


    );
};

export default JoinChatRoom;
