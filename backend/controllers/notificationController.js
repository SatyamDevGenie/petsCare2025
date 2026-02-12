import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";

/**
 * Get all notifications for the logged-in user (pet owner)
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. User credentials required.",
    });
  }

  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

/**
 * Mark a notification as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOne({
    _id: id,
    recipient: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
});

/**
 * Mark all notifications as read for the current user
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

export { getMyNotifications, markAsRead, markAllAsRead };
