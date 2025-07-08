import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const subscribeToChannel = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    console.log("Incoming subscribe request to channelId:", channelId);
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const userId = req.user._id;
    console.log("Logged-in user (subscriber):", userId);
    const user = await User.findById(userId);
    const channel = await User.findById(channelId);
    if(!user || !channel ){
        throw new ApiError(404, "User or channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    if(existingSubscription){
        throw new ApiError(400, "You are already subscribed to this channel");
    }

    const subscription = await Subscription.create({
        subscriber:userId,
        channel:channelId
    });

    return res.status(200).json(
        new ApiResponse(200, subscription,"Subscribed to channel successfully")
    )
})

const unsubscribeToChannel = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    console.log("Incoming unsubscribe request from channelId:", channelId);
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const userId = req.user._id;
    console.log("Logged-in user (subscriber):", userId);
    const user = await User.findById(userId);
    const channel = await User.findById(channelId);
    if(!user || !channel ){
        throw new ApiError(404, "User or channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    console.log(existingSubscription);

    if(!existingSubscription){
        throw new ApiError(400, "You are not subscribed to this channel");
    }

    await Subscription.deleteOne({
        subscriber: userId,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, null,"Unsubscribed from channel successfully")
    )
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    const count = await Subscription.countDocuments({ channel: channelId });
    res.status(200).json(
        new ApiResponse(200,{subscriberCount: count}, "Fetched subscribers successfully")
    )
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const subscribedChannels = await Subscription.find({subscriber: userId})

    res.status(200).json(
        new ApiResponse(200, subscribedChannels, subscribedChannels.length, "Fetched subscribed channels successfully")
    )
});



export {subscribeToChannel,unsubscribeToChannel,getUserChannelSubscribers,getSubscribedChannels};

