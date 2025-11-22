import React, { useEffect, useState } from "react";
import { getNotifications } from "../api/notificationApi";

const NotificationPopup = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const data = await getNotifications(userId);
    setNotifications(data);
  };

  return (
    <div className="notification-popup">
      {notifications.map((n) => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
};

export default NotificationPopup;
