import { VideoCameraOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Typography } from 'antd';
import React from 'react';
import './RoomHeader.css';

const {Title} = Typography;

interface RoomHeaderProps {
    roomName: string;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({roomName}) => {
    return (<Flex vertical={ false } className="chat-header" align="center" justify="space-between"
                  style={ {width: '100%'} }>
        <Space direction="vertical" className="chat-about">
            <Title className="m-b-0" level={ 4 }>{ roomName }</Title>
        </Space>
        <Button type="default" icon={ <VideoCameraOutlined/> } className="chat-btn"/>
    </Flex>);
};

export default RoomHeader;
