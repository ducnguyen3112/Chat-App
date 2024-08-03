import { ConfigProvider } from 'antd';
import React from 'react';
import './App.css';
import ChatRoom from './pages/chat-room/ChatRoom';

const App: React.FC = () => {
    return <ConfigProvider
        theme={ {
            components: {
                Menu: {
                    activeBarBorderWidth: 0, itemHeight: 60,
                },
            },
        } }
    >
        <ChatRoom/>
    </ConfigProvider>;
};

export default App;
