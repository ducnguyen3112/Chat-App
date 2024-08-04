import { Flex } from 'antd';
import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import { FileProps } from '../../pages/chat-room/ChatRoom';
import MessageHistory from '../message/MessageHistory';
import RoomHeader from '../room-header/RoomHeader';
import { Room } from '../sidebar/Sidebar';

interface ChatWindowProps {
    messages?: Message[];
    room: Room;
    username: string;
}

export interface Message {
    id: string;
    text: string;
    time: string;
    sendBy: string;
    files?: FileProps[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({messages, room, username}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages]);

    return <Flex vertical={ true }>
        <RoomHeader roomName={ room.name }/>
        <div className="chat-window" ref={ ref }>
            { messages?.map((msg) => (<MessageHistory message={ msg } key={ msg.id } username={ username }/>)) }
        </div>
    </Flex>;
};

export default ChatWindow;
