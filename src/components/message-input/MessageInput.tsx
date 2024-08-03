import { SendOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import './MessageInput.css';

interface MessageInputProps {
    onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({onSend}) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            }
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Flex className="message-input" gap="middle">
            <TextArea
                value={ message }
                onChange={ (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value) }
                onKeyDown={ handleKeyDown }
                placeholder="Type your message here..."
                className="text-area"
                style={ {height: 60, resize: 'none'} }
            />
            { message && (
                <Button
                    onClick={ handleSend }
                    icon={ <SendOutlined style={ {color: 'blue'} }/> }
                    type="text"
                />
            ) }
        </Flex>
    );
};

export default MessageInput;
