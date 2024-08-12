import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

export const sendMessage = async (req: any, res: any) => {
    try {
        const receivedId = req.params.id;
        const senderId = req.id;
        const {message} = req.body

        let conversation: any = await Conversation.findOne({
            participants: [receivedId, senderId]
        })
        if (!conversation) {
            conversation = Conversation.create({
                participants: [receivedId, senderId]
            })}
            const newMessage = await Message.create({
                senderId,
                receivedId,
                message
            })
            if(newMessage) conversation.messages.push(newMessage._id);

        
        await Promise.all([conversation.save(),newMessage.save()])


        return res.status(201).json({
            success:true,
            newMessage
        })

    } catch (error) {
        console.log(error)
    }
}


export const getMessage = async (req:any,res:any) => {

    try {

        const receivedId = req.params.id;
        const senderId = req.id;
        let conversation: any = await Conversation.findOne({
            participants: [receivedId, senderId]
        }).populate('messages')

        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
    } catch (error) {
        console.log(error)
    }
}