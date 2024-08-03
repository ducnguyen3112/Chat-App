import { PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Flex, Form, Input, Menu, MenuProps, Modal, Space } from 'antd';
import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
    rooms: Room[];
    onSelectRoom: (room: Room) => void;
    onCreateRoom: (name: string) => Promise<void>;
    onSearchRoom: (keyword: string) => void;
    username: string;
}

export interface Room {
    avatar?: string;
    name: string;
    createdDate: number;
    updatedDate: number;
    unreadCount: Map<string, number>;
}

const Sidebar: React.FC<SidebarProps> = ({rooms, onSelectRoom, onCreateRoom, onSearchRoom, username}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [roomName, setRoomName] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await onCreateRoom(roomName);
            setRoomName('');
            setIsModalVisible(false);
        } catch (error) {
            // Handle the error if room creation fails, e.g., show an error message
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const menuItems = rooms.map((room) => ({
        key: room.name, label: (<Space className="room">
            <Badge count={ room.unreadCount.get(username) }>
                <Avatar src={ room.avatar }/>
            </Badge>
            <Space style={ {marginLeft: 8} }>{ room.name }</Space>
        </Space>),
    }));

    const onSelectMenu: MenuProps['onClick'] = (e) => {
        onSelectRoom(rooms.find(room => room.name === e.key) as Room);
    };

    return <Flex className="sidebar" vertical={ true }>
        <Input placeholder="Search Room..." style={ {marginBottom: 16} }
               onChange={ (e) => onSearchRoom(e.target.value) }/>
        <Button type="primary" icon={ <PlusCircleOutlined/> } onClick={ showModal }>Create New Room</Button>
        <Menu theme="light" items={ menuItems } onClick={ onSelectMenu }/>
        <Modal title="Create New Room" open={ isModalVisible } onOk={ handleOk } onCancel={ handleCancel }>
            <Form>
                <Form.Item label="Room Name">
                    <Input value={ roomName } onChange={ (e) => setRoomName(e.target.value) }/>
                </Form.Item>
            </Form>
        </Modal>
    </Flex>;
};

export default Sidebar;
