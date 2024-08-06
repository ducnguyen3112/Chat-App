import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import JoinChatRoom from './components/join-chat/JoinChatRoom';
import VideoCall from './components/video-call/VideoCall';
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

    return <Routes>
        <Route path="/"
               element={ username ? <ChatRoom username={ username }/> : <JoinChatRoom onJoin={ handleJoin }/> }/>
        <Route path="/video-calling/:roomId" element={ <VideoCall/> }></Route>
    </Routes>;
};

export default App;
