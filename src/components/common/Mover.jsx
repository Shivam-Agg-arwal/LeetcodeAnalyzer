import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Mover = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/manage");
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div>
            {/* Optionally, you can display a loading spinner or message here */}
            Loading...
        </div>
    );
}

export default Mover;
