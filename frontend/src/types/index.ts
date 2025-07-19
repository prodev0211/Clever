export interface User {
  id: string;
  username: string;
  email: string;
  discriminator: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: {
    text?: string;
    emoji?: string;
  };
  isEmailVerified: boolean;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  privacy: {
    allowDMs: boolean;
    showStatus: boolean;
  };
}

export interface Guild {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  memberCount: number;
  maxMembers: number;
  verificationLevel: string;
  features: string[];
  settings: GuildSettings;
}

export interface GuildSettings {
  defaultNotifications: 'all_messages' | 'only_mentions';
  systemChannelId?: string;
  rulesChannelId?: string;
  publicUpdatesChannelId?: string;
}

export interface Channel {
  id: string;
  guildId?: string;
  name: string;
  type: ChannelType;
  topic?: string;
  position: number;
  parentId?: string;
  permissionOverwrites: PermissionOverwrite[];
  nsfw: boolean;
  rateLimitPerUser: number;
  recipients?: string[];
  lastMessageId?: string;
}

export type ChannelType = 
  | 'GUILD_TEXT'
  | 'GUILD_VOICE'
  | 'GUILD_CATEGORY'
  | 'GUILD_NEWS'
  | 'GUILD_STAGE_VOICE'
  | 'DM'
  | 'GROUP_DM';

export interface PermissionOverwrite {
  id: string;
  type: 'role' | 'member';
  allow: string;
  deny: string;
}

export interface Role {
  id: string;
  guildId: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  mentionable: boolean;
  managed: boolean;
  icon?: string;
  unicode_emoji?: string;
}

export interface GuildMember {
  guildId: string;
  userId: string;
  nick?: string;
  avatar?: string;
  roles: string[];
  joinedAt: string;
  premiumSince?: string;
  deaf: boolean;
  mute: boolean;
  pending: boolean;
  permissions: string;
  communicationDisabledUntil?: string;
}

export interface Message {
  id: string;
  channelId: string;
  guildId?: string;
  authorId: string;
  content: string;
  embeds: Embed[];
  attachments: Attachment[];
  mentions: string[];
  mentionRoles: string[];
  mentionChannels: string[];
  mentionEveryone: boolean;
  pinned: boolean;
  tts: boolean;
  type: MessageType;
  flags: number;
  editedTimestamp?: string;
  webhookId?: string;
  applicationId?: string;
  messageReference?: MessageReference;
  interaction?: MessageInteraction;
  thread?: ThreadMetadata;
  components: Component[];
  stickerItems: StickerItem[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type MessageType = 
  | 'DEFAULT'
  | 'RECIPIENT_ADD'
  | 'RECIPIENT_REMOVE'
  | 'CALL'
  | 'CHANNEL_NAME_CHANGE'
  | 'CHANNEL_ICON_CHANGE'
  | 'CHANNEL_PINNED_MESSAGE'
  | 'USER_JOIN'
  | 'GUILD_BOOST'
  | 'GUILD_BOOST_TIER_1_THRESHOLD'
  | 'GUILD_BOOST_TIER_2_THRESHOLD'
  | 'GUILD_BOOST_TIER_3_THRESHOLD'
  | 'CHANNEL_FOLLOW_ADD'
  | 'GUILD_DISCOVERY_DISQUALIFIED'
  | 'GUILD_DISCOVERY_REQUALIFIED'
  | 'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING'
  | 'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING'
  | 'THREAD_CREATED'
  | 'REPLY'
  | 'CHAT_INPUT_COMMAND'
  | 'THREAD_STARTER_MESSAGE'
  | 'GUILD_INVITE_REMINDER'
  | 'CONTEXT_MENU_COMMAND'
  | 'AUTO_MODERATION_ACTION'
  | 'ROLE_SUBSCRIPTION_PURCHASE'
  | 'INTERACTION_PREMIUM_UPSELL'
  | 'STAGE_START'
  | 'STAGE_END'
  | 'STAGE_SPEAKER'
  | 'STAGE_TOPIC'
  | 'GUILD_APPLICATION_PREMIUM_SUBSCRIPTION';

export interface Embed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export interface EmbedImage {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideo {
  url: string;
  height?: number;
  width?: number;
}

export interface EmbedProvider {
  name: string;
  url: string;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Attachment {
  id: string;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
  ephemeral?: boolean;
}

export interface MessageReference {
  messageId?: string;
  channelId?: string;
  guildId?: string;
  failIfNotExists?: boolean;
}

export interface MessageInteraction {
  id: string;
  type: string;
  name: string;
  user: string;
}

export interface ThreadMetadata {
  archived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp?: string;
  locked: boolean;
  invitable: boolean;
  createTimestamp?: string;
}

export interface Component {
  type: 'ACTION_ROW' | 'BUTTON' | 'SELECT_MENU' | 'TEXT_INPUT';
  components: any[];
}

export interface StickerItem {
  id: string;
  name: string;
  format_type: 'PNG' | 'APNG' | 'LOTTIE' | 'GIF';
}

export interface Invite {
  code: string;
  guildId: string;
  channelId: string;
  inviterId: string;
  targetType?: string;
  targetUserId?: string;
  targetApplicationId?: string;
  maxAge: number;
  maxUses: number;
  uses: number;
  temporary: boolean;
  createdAt: string;
  expiresAt?: string;
  flags: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface SocketEvents {
  READY: (data: { user: User; sessionId: string }) => void;
  PRESENCE_UPDATE: (data: { userId: string; status: string; customStatus?: any }) => void;
  TYPING_START: (data: { channelId: string; userId: string; username: string }) => void;
  TYPING_STOP: (data: { channelId: string; userId: string }) => void;
  MESSAGE_CREATE: (data: Message) => void;
  MESSAGE_UPDATE: (data: Message) => void;
  MESSAGE_DELETE: (data: { id: string; channelId: string }) => void;
  CHANNEL_CREATE: (data: Channel) => void;
  CHANNEL_UPDATE: (data: Channel) => void;
  CHANNEL_DELETE: (data: { id: string; guildId?: string }) => void;
  GUILD_CREATE: (data: Guild) => void;
  GUILD_UPDATE: (data: Guild) => void;
  GUILD_DELETE: (data: { id: string }) => void;
  HEARTBEAT_ACK: () => void;
}