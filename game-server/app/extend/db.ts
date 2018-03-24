import * as mongoose from 'mongoose'
import { FeedbackSchema } from '../models/feedback';
import { MailSchema } from '../models/mail';
import { OrderSchema } from '../models/order';
import { RecordSchema } from '../models/record';
import { RedPacketSchema } from '../models/redPacket';
import { UserSchema } from '../models/user';
import { CuratorSchema } from '../models/curator';
import { AgentSchema } from '../models/agent';
import { CuratorGroupSchema } from '../models/curatorGroup';

export const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
export const MailModel = mongoose.model('Mail', MailSchema);
export const OrderModel = mongoose.model('Order', OrderSchema);
export const RecordModel = mongoose.model('Record', RecordSchema);
export const RedPacketModel = mongoose.model('RedPacket', RedPacketSchema);
export const UserModel = mongoose.model('User', UserSchema);
export const CuratorModel = mongoose.model('Curator',CuratorSchema);
export const AgentModel = mongoose.model('Agent',AgentSchema);
export const CuratorGroupModel = mongoose.model('CuratorGroup',CuratorGroupSchema);