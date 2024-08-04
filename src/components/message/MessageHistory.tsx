import { FileOutlined } from '@ant-design/icons';
import { Card, Flex, Image } from 'antd';
import React from 'react';
import { Message } from '../chat-window/ChatWindow';
import './MessageHistory.css';


interface MessageProps {
    message: Message;
    username: string;
}

const MessageHistory: React.FC<MessageProps> = ({message, username}) => {
    const isImage = (name: string) => {
        return name.match(/\.(jpeg|jpg|gif|png)$/i);
    };


    return (
        <Flex vertical={ true }
              className={ `message-container ${ username === message.sendBy ? 'my-message' : 'other-message' }` }>
            <Flex gap={ '2' } className={ 'message-info' }>
                { username !== message.sendBy && <div className="message-owner">{ message.sendBy }</div> }
                <div className="message-time">{ message.time }</div>
            </Flex>
            <Flex vertical={ false }>
                { message?.files?.map((file) => (
                    isImage(file.name) ? (
                        <Card className={ 'card' } hoverable>
                            <Image width={ '100%' } src={ file.url }
                                   fallback="https://consumersiteimages.trustpilot.net/business-units/60865524cf8db50001cc3926-198x149-1x.jpg"/>
                        </Card>
                    ) : (
                        <a href={ file.url } download target={ '_blank' }>
                            <Card className={ 'card' } hoverable>
                                <FileOutlined className={ 'download-file' }/>
                                <div className={ 'text-ellipsis' }>{ file.name }</div>
                            </Card>
                        </a>
                    )
                )) }
            </Flex>
            { message.text && <div className="message-bubble">
                { message.text }
            </div> }
        </Flex>);
};

export default MessageHistory;
