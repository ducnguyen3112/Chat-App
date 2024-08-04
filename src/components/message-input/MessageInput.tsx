import { PaperClipOutlined, PlusCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Flex, message as antMessage, Upload, UploadFile, UploadProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import './MessageInput.css';

interface MessageInputProps {
    onSend: (message: string, files: UploadFile[]) => void;
}

const props: UploadProps = {
    listType: 'picture-card',
};

const MessageInput: React.FC<MessageInputProps> = ({onSend}) => {
    const [message, setMessage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isOpenAttachFile, setIsOpenAttachFile] = useState(false);
    const fileInputRef = React.useRef<HTMLButtonElement>(null);

    const handleSend = () => {
        if (message.trim() || fileList.length > 0) {
            onSend(message, fileList);
            setMessage('');
            setFileList([]);
            setIsOpenAttachFile(false);
        }
    };

    const beforeUpload = (file: File) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            antMessage.error('File size must be smaller 5MB.');
        }
        return isLt5M ? true : Upload.LIST_IGNORE;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            }
            e.preventDefault();
            handleSend();
        }
    };

    const handleUploadChange = ({fileList}: {fileList: any[]}) => {
        setFileList(fileList);
    };

    const handleOpenAttachFile = () => {
        setIsOpenAttachFile(!isOpenAttachFile);
    };

    return (
        <Flex className="message-input">
            { isOpenAttachFile &&
                <Upload
                    { ...props }
                    beforeUpload={ beforeUpload }
                    multiple
                    fileList={ fileList }
                    onChange={ handleUploadChange }
                    maxCount={ 13 }
                    className="upload-list-inline">
                    <Button icon={ <PlusCircleOutlined/> } ref={ fileInputRef }/>
                </Upload> }

            <Flex className="message-input-container">
                <Button icon={ <PaperClipOutlined/> } onClick={ handleOpenAttachFile }/>
                <TextArea
                    value={ message }
                    onChange={ (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value) }
                    onKeyDown={ handleKeyDown }
                    placeholder="Type your message here..."
                    style={ {resize: 'none', height: '34px'} }
                />
                { (message || fileList.length > 0) && (
                    <Button
                        onClick={ handleSend }
                        icon={ <SendOutlined style={ {color: 'blue'} }/> }
                        type="text"
                    />
                ) }
            </Flex>
        </Flex>
    );
};

export default MessageInput;
