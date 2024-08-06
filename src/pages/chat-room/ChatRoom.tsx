import { ConfigProvider, Flex, Layout, message, Typography, UploadFile } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { formatDistanceToNow } from 'date-fns';

import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ChatWindow, { Message } from '../../components/chat-window/ChatWindow';
import MessageInput from '../../components/message-input/MessageInput';
import Sidebar, { Room } from '../../components/sidebar/Sidebar';
import './ChatRoom.css';

import { db, storage } from '../../config/firebase';

interface ChatRoomProps {
    username: string;
}

export interface FileProps {
    name: string;
    url: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({username}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchRoomText, setSearchRoomText] = useState('');

    const handleSearchRoom = async (keyword: string) => {
        setSearchRoomText(keyword);
    };

    const handleCreateRoom = async (roomName: string) => {
        const roomRef = doc(db, 'chat-rooms', roomName);
        const roomDoc = await getDoc(roomRef);

        if (roomDoc.exists()) {
            message.error(`Room with the name "${ roomName }" already exists.`);
            throw new Error('Room already exists');
        } else {
            await setDoc(roomRef, {
                name: roomName,
                createdDate: Date.now(),
                updatedDate: Date.now(),
                avatar: `https://ui-avatars.com/api/?name=${ roomName }`,
                createdBy: username,
            });
            message.success(`Room ${ roomName } created successfully.`);
        }
    };

    useEffect(() => {
        const q = query(
            collection(db, 'chat-rooms'),
            where('name', '>=', searchRoomText),
            where('name', '<=', searchRoomText + '\uf8ff'),
            orderBy('updatedDate', 'desc'),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const roomList: Room[] = [];
            querySnapshot.forEach((doc) => {
                const res = doc.data();

                const unreadCount = res.unreadCount || {};
                const unreadCountMap = new Map<string, number>(
                    Object.entries(unreadCount).map(([key, value]) => [key, Number(value)]),
                );
                roomList.push({
                    avatar: res.avatar,
                    name: res.name,
                    createdDate: res.createdDate,
                    updatedDate: res.updatedDate,
                    unreadCount: unreadCountMap,
                });
            });
            setRooms(roomList);
        });

        return () => unsubscribe();
    }, [searchRoomText]);

    useEffect(() => {
        if (selectedRoom) {
            const q = query(
                collection(db, 'messages'),
                where('room', '==', selectedRoom.name),
                orderBy('createdDate'),
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesRes: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const res = doc.data();
                    messagesRes.push({
                        id: doc.id,
                        sendBy: res.sendBy,
                        text: res.text,
                        time: formatDistanceToNow(new Date(res.createdDate), {addSuffix: true}),
                        files: res.files,
                    });
                });

                setMessages(messagesRes);
            });

            return () => unsubscribe();
        }
    }, [selectedRoom]);

    const handleSend = async (message: string, files: UploadFile[]) => {
        if (selectedRoom) {
            const uploadFiles: FileProps[] = [];
            if (files.length > 0) {
                for (const file of files) {
                    const storageRef = ref(storage, uuid());
                    if (file?.originFileObj) {
                        const fileData = await file.originFileObj.arrayBuffer();
                        const uploadTask = uploadBytesResumable(storageRef, fileData, {
                            contentType: file.type ?? file.originFileObj.type,
                            customMetadata: {
                                fileName: file.name,
                            },
                        });
                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                () => {
                                },
                                (error) => {
                                    console.error('File upload error:', error);
                                    reject(error);
                                },
                                async () => {
                                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                    uploadFiles.push({
                                        url: downloadURL,
                                        name: file.name,
                                    } as FileProps);
                                    resolve();
                                },
                            );
                        });
                    }

                }
            }


            const data = {
                text: message,
                createdDate: Date.now(),
                sendBy: username,
                room: selectedRoom?.name,
                files: uploadFiles,
            };
            console.log(data);
            await addDoc(collection(db, 'messages'), data);
            const roomRef = doc(db, 'chat-rooms', selectedRoom.name);
            await updateDoc(roomRef, {
                updatedDate: Date.now(),
            });

            const roomDoc = await getDoc(roomRef);
            const roomData = roomDoc.data();
            const unreadCount = roomData?.unreadCount || {};
            Object.keys(unreadCount).forEach(user => {
                if (user !== username) {
                    unreadCount[user] = (unreadCount[user] || 0) + 1;
                }
            });
            unreadCount[username] = 0;
            await updateDoc(roomRef, {unreadCount});
        }

    };

    const handleSelectRoom = async (room: Room) => {
        const roomRef = doc(db, 'chat-rooms', room.name);
        const roomDoc = await getDoc(roomRef);
        const roomData = roomDoc.data();
        const unreadCount = roomData?.unreadCount || {};
        unreadCount[username] = 0;
        await updateDoc(roomRef, {unreadCount});
        setSelectedRoom(room);
    };

    return (
        <ConfigProvider
            theme={ {
                components: {
                    Menu: {
                        activeBarBorderWidth: 0, itemHeight: 60,
                    },
                },
            } }
        >
            <Layout className={ 'chat-room' }>
                <Sider width={ 400 } theme={ 'light' }>
                    <Sidebar
                        rooms={ rooms }
                        onCreateRoom={ handleCreateRoom }
                        onSelectRoom={ handleSelectRoom }
                        onSearchRoom={ handleSearchRoom }
                        username={ username }
                    />
                </Sider>
                <Layout>
                    <Content className={ 'content' }>
                        { selectedRoom ?
                            <Flex vertical={ true } className={ 'chat-content' } justify={ 'space-between' }>
                                <ChatWindow messages={ messages } room={ selectedRoom } username={ username }/>
                                <MessageInput onSend={ handleSend }/>
                            </Flex> :
                            <Flex vertical={ true } justify="center" align="middle" className={ 'welcome' }>
                                <Typography.Title level={ 1 } className={ 'welcome-title' }>Welcome
                                    back, { username }!</Typography.Title>
                                <Typography.Text className={ 'welcome-text' }>Choose a room to start
                                    chatting.</Typography.Text>
                            </Flex>
                        }
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default ChatRoom;
