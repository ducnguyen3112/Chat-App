import { Flex } from 'antd';
import React from 'react';
import { Message } from '../chat-window/ChatWindow';
import './MessageHistory.css';

interface MessageProps {
    message: Message;
    username: string;
}

const MessageHistory: React.FC<MessageProps> = ({message, username}) => {
    return (
        <Flex vertical={ true }
              className={ `message-container ${ username === message.sendBy ? 'my-message' : 'other-message' }` }>
            <Flex gap={ '2' } className={ 'message-info' }>
                { username !== message.sendBy && <div className="message-owner">{ message.sendBy }</div> }
                <div className="message-time">{ message.time }</div>
            </Flex>
            <div className="message-bubble">
                { message.text }
            </div>
        </Flex>);
};

export default MessageHistory;
