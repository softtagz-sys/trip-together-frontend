import { useParams } from 'react-router-dom';
import RoomPage from '@/components/roomPage/RoomPage';

const Room = () => {
    const { code } = useParams<{ code: string }>();

    return <RoomPage code={code as string} />;
};

export default Room;