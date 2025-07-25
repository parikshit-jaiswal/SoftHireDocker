const Conversation = require('../models/Coversation.model.js');
const mongoose = require('mongoose');
const Message = require('../models/Message.model.js');
const Recruiter = require('../models/Recruiter.js');
const ObjectId = mongoose.Types.ObjectId;

exports.getConversationsForUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.user.id);
        const conversations = await Conversation.aggregate([
            { $match: { participants: userId } },
            {
                $addFields: {
                    otherUserId: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    cond: { $ne: ["$$this", userId] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            // Ensure otherUserId is ObjectId
            {
                $addFields: {
                    otherUserId: { $toObjectId: "$otherUserId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "otherUserId",
                    foreignField: "_id",
                    as: "otherUser"
                }
            },
            { $unwind: "$otherUser" },
            {
                $lookup: {
                    from: "recruiters",
                    localField: "otherUserId",
                    foreignField: "userId",
                    as: "recruiter"
                }
            },
            { $unwind: { path: "$recruiter", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "organizations",
                    localField: "recruiter.organization",
                    foreignField: "_id",
                    as: "organization"
                }
            },
            { $unwind: { path: "$organization", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "messages",
                    let: { convoId: "$_id", userId: userId },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$conversationId", "$$convoId"] },
                                        { $eq: ["$receiver", "$$userId"] },
                                        { $eq: ["$read", false] }
                                    ]
                                }
                            }
                        },
                        { $count: "unreadCount" }
                    ],
                    as: "unreadMessages"
                }
            },
            {
                $addFields: {
                    unreadCount: {
                        $cond: [
                            { $gt: [{ $size: "$unreadMessages" }, 0] },
                            { $arrayElemAt: ["$unreadMessages.unreadCount", 0] },
                            0
                        ]
                    }
                }
            },
            // Add last message lookup for last updated
            {
                $lookup: {
                    from: "messages",
                    let: { convoId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$conversationId", "$$convoId"] } } },
                        { $sort: { updatedAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "lastMessage"
                }
            },
            {
                $addFields: {
                    lastMessageUpdatedAt: { $ifNull: [ { $arrayElemAt: ["$lastMessage.updatedAt", 0] }, "$updatedAt" ] }
                }
            },
            {
                $project: {
                    recruiterId: "$otherUser._id",
                    recruiterName: "$otherUser.fullName",
                    companyName: "$recruiter.companyName",
                    unreadCount: 1,
                    status: 1,
                    lastMessageUpdatedAt: 1
                }
            }
        ]);
        // console.log("Conversations with pipeline:", conversations);

        res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error("Error fetching conversations with pipeline:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch conversations with pipeline."
        });
    }
};




exports.getRecentChats = async (req, res) => {
    try {
        const userId = req.user.id; // Assumes authentication middleware sets req.user

        // Find all conversations where the user is a participant
        const conversations = await Conversation.aggregate([
            { $match: { participants: new mongoose.Types.ObjectId(userId) } },
            // Save the conversationId for later use
            { $addFields: { conversationId: '$_id' } },
            { $unwind: '$participants' },
            { $match: { participants: { $ne: new mongoose.Types.ObjectId(userId) } } }, // Get the other participant
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'participants',
                    foreignField: 'userId',
                    as: 'profile'
                }
            },
            { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'profileimages',
                    let: { userId: '$participants' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'profileImageDoc'
                }
            },
            { $unwind: { path: '$profileImageDoc', preserveNullAndEmptyArrays: true } },
            // Lookup last message for lastUpdated
            {
                $lookup: {
                    from: 'messages',
                    let: { convoId: '$conversationId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$conversationId', '$$convoId'] } } },
                        { $sort: { updatedAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'lastMessage'
                }
            },
            {
                $addFields: {
                    lastUpdated: {
                        $ifNull: [
                            { $arrayElemAt: ['$lastMessage.updatedAt', 0] },
                            '$updatedAt'
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: '$participants',
                    name: '$profile.name',
                    primaryRole: '$profile.primaryRole',
                    profileImage: '$profileImageDoc.imageUrl',
                    status: 1,
                    lastUpdated: 1
                }
            }
        ]);

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching recent chats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getChatsWithUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { receiverId } = req.params;

        // Find the conversation between the two users
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] }
        });

        if (!conversation) {
            return res.status(404).json({ message: 'No conversation found.' });
        }

        // Get all messages between the two users in this conversation
        const messages = await Message.find({
            conversationId: conversation._id
        })
            .sort({ createdAt: 1 }) // oldest to newest
            .lean();

        res.status(200).json({
            conversationId: conversation._id,
            messages
        });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Toggle chat status (active <-> archived or set to provided status)
exports.toggleConversationStatus = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { status } = req.body;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        if (status && ["active", "archived"].includes(status)) {
            conversation.status = status;
        } else {
            // Toggle if no valid status provided
            conversation.status = conversation.status === "active" ? "archived" : "active";
        }
        await conversation.save();
        res.status(200).json({
            success: true,
            conversationId: conversation._id,
            newStatus: conversation.status
        });
    } catch (error) {
        console.error("Error toggling conversation status:", error);
        res.status(500).json({ error: "Failed to toggle conversation status" });
    }
};