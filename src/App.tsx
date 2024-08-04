import { ConfigProvider, Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.css';
import JoinChatRoom from './components/join-chat/JoinChatRoom';
import ChatRoom from './pages/chat-room/ChatRoom';

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    const handleJoin = (name: string) => {
        setUsername(name);
    };

    return <ConfigProvider
        theme={ {
            components: {
                Menu: {
                    activeBarBorderWidth: 0, itemHeight: 60,
                },
            },
        } }
    >
        <Layout>
            { !username ? (
                <JoinChatRoom onJoin={ handleJoin }/>
            ) : (
                <ChatRoom username={ username }/>
            ) }
        </Layout>
    </ConfigProvider>;
};

export default App;
