import { VideoCameraOutlined } from '@ant-design/icons';
import { Button, Flex, Space, Typography } from 'antd';
import React from 'react';
import './RoomHeader.css';
import { encodeBase64 } from '../../utils/base64Utils';

const {Title} = Typography;

interface RoomHeaderProps {
    roomName: string;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({roomName}) => {

    const handleVideoCall = () => {
        const width = 852;
        const height = 500;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        const videoCallUrl = `/video-calling/${ encodeBase64(roomName) }`;
        window.open(videoCallUrl, '_blank', `width=${ width },height=${ height },top=${ top },left=${ left }`);
    };

    return (<Flex vertical={ false } className="chat-header" align="center" justify="space-between"
                  style={ {width: '100%'} }>
        <Space direction="vertical" className="chat-about">
            <Title className="m-b-0" level={ 4 }>{ roomName }</Title>
        </Space>
        <Button type="default" icon={ <VideoCameraOutlined/> } className="chat-btn" onClick={ handleVideoCall }/>
    </Flex>);
};

export default RoomHeader;
