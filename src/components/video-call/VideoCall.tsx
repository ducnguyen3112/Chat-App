import { Flex } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.css';
import { useParams } from 'react-router-dom';
import SimplePeer, { Instance } from 'simple-peer';
import { io } from 'socket.io-client';

const socketUrl = 'http://localhost:5000';
const username = localStorage.getItem('username');


const VideoCall: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const {roomId} = useParams<string>();
    const peerRef = useRef<Instance | null>(null);
    

    const socket = io(socketUrl, {
        auth: {
            username: username,
            room: roomId,
        },
    });
    useEffect(() => {
        const initRTC = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

                socket.emit('join', {username: username, room: roomId});

                socket.on('user-joined', (socketID: string) => {
                    console.log('User joined:', socketID);
                    const peer = new SimplePeer({
                        initiator: true,
                        trickle: false,
                        stream: mediaStream,
                    });
                    peerRef.current = peer;

                    peer.on('signal', (data) => {
                        socket.emit('signal', {room: roomId, signal: data});
                    });

                    peer.on('stream', (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                    });
                });

                socket.on('signal', (data) => {
                    if (!peerRef.current) {
                        const peer = new SimplePeer({
                            initiator: false,
                            trickle: false,
                            stream: mediaStream,
                        });

                        peer.on('signal', (signalData) => {
                            socket.emit('signal', {room: roomId, signal: signalData});
                        });

                        peer.on('stream', (remoteStream) => {
                            if (remoteVideoRef.current) {
                                remoteVideoRef.current.srcObject = remoteStream;
                            }
                        });

                        peer.signal(data.signal);
                        peerRef.current = peer;
                    } else {
                        peerRef.current.signal(data.signal);
                    }
                });

                socket.on('user-disconnected', (socketID: string) => {
                    console.log('User disconnected:', socketID);
                    if (peerRef.current) {
                        peerRef.current.destroy();
                        peerRef.current = null;
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = null;
                        }
                    }
                });
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initRTC();

        return () => {
            socket.disconnect();
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    return (
        <div className="video-call-container">
            <video
                ref={ videoRef }
                autoPlay
                muted
                className="video-card video-card-me"
            ></video>
            <Flex className="list-video-call" gap="5px">
                <video
                    ref={ remoteVideoRef }
                    autoPlay
                    muted
                    className="video-card"
                ></video>
            </Flex>
        </div>
    );
};

export default VideoCall;
