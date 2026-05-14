import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 🛑 URGENT: KEEP baseUrl as '' OR THE DASHBOARD WILL STOP WORKING.
// Your browser blocks direct requests to ngrok (CORS). 
// The real URL is handled by the Next.js proxy in next.config.ts.
const baseUrl = 'https://doleritic-goutily-shila.ngrok-free.dev';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const access = (getState() as any).auth.access;
    if (access) headers.set('Authorization', `Bearer ${access}`);
    headers.set('Content-Type', 'application/json');
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserListItem = {
  id: number;
  email: string;
  is_active: boolean;
  is_email_verified: boolean;
  role: string;
  user_type: string;
  approval_status: string;
  created_at: string;
  total_bids: number;
  total_auctions: number;
};

export type UserDetail = {
  id: number;
  email: string;
  role: string;
  user_type: string;
  is_active: boolean;
  is_email_verified: boolean;
  approval_status: string;
  is_two_factor_enabled: boolean;
  created_at: string;
  profile: {
    phone: string;
    address: string;
    website: string;
    uid: string;
    company: string;
    license_url: string;
    photo_url?: string;
    id_document_url?: string;
    full_name?: string;
  };
  stats: {
    auctions_created: number;
    auctions_won: number;
    total_bids: number;
    active_auctions: number;
  };
};

export type PaginatedUsers = {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserListItem[];
};

export type AuctionImage = {
  url: string;
  position: number;
};

export type AuctionListItem = {
  id: number;
  title: string;
  vehicle_brand: string;
  seller_name: string;
  current_highest_bid: string | null;
  reserve_price: string;
  status: string;
  ends_at: string;
  total_bidders: number;
  images: AuctionImage[];
  created_by_email: string;
};

export type AuctionDetail = {
  id: number;
  title: string;
  description: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_category: string;
  vehicle_year: number;
  vehicle_mileage: number;
  vehicle_vin_number: string;
  vehicle_fuel_type: string;
  vehicle_location: string;
  reserve_price: string;
  buy_now_price: string;
  status: string;
  starts_at: string;
  ends_at: string;
  winner_id: number | null;
  sold_at: string | null;
  images: AuctionImage[];
  video_url: string;
  document_url: string;
  created_at: string;
  seller_name: string;
  current_highest_bid: string | null;
  total_bidders: number;
  is_flagged: boolean;
  admin_note: string;
  is_watchlisted: boolean;
  bidder_count: number;
  bid_raise_count: number;
  view_count: number;
  watchlist_count: number;
  created_by_email: string;
};

export type BidItem = {
  bidder_email: string;
  bidder_id: number;
  amount: string;
  increment: string;
  amount_after: string;
  created_at: string;
};

export type PaginatedBids = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BidItem[];
};

export type DashboardStats = {
  active_dealers: number;
  total_auctions: number;
  live_auctions: number;
  completed_sales: number;
  avg_vehicle_price: string;
  total_revenue: string;
};

export type AuctionTrendItem = {
  month_number: number;
  month_label: string;
  created_count: number;
};

export type AuctionTrends = {
  auction_volume: AuctionTrendItem[];
};

export type RevenueTrendItem = {
  month_number: number;
  month_label: string;
  revenue: string;
};

export type RevenueTrends = {
  revenue_trends: RevenueTrendItem[];
};

export type PlanBreakdownItem = {
  plan_name: string;
  total_subscribers: number;
  percentage: number;
};

export type PlanBreakdown = {
  plans: PlanBreakdownItem[];
};

export type AuditLogItem = {
  id: number;
  actor_email: string;
  actor_role: string;
  action: string;
  target_type: string;
  target_id: string;
  description: string;
  ip_address: string;
  created_at: string;
};

export type PaginatedAuditLogs = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditLogItem[];
};

export type AdminProfile = {
  id: number;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export type ChangePlanResponse = {
  message: string;
  new_plan: string;
  effective_date: string;
};

export type SupportContact = {
  support_email: string;
  support_phone: string;
};

export type SubscriptionItem = {
  id: number;
  user_id: number;
  user_email: string;
  plan: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
};

export type PaginatedSubscriptions = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubscriptionItem[];
};

export type InvoiceItem = {
  invoice_id: string;
  amount_paid: string;
  currency: string;
  status: string;
  created: number;
  hosted_invoice_url: string;
  period_start?: number;
  period_end?: number;
};

export type UserSubscriptionDetail = SubscriptionItem & {
  new_plan?: string;
  effective_date?: string;
  payment_method: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  invoices: InvoiceItem[];
};

export type PlanItem = {
  id: number;
  plan: string;
  stripe_price_id: string;
  price: string;
  currency: string;
  interval: string;
};

export type PaginatedAuctions = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuctionListItem[];
};

export type ChatUser = {
  id: number;
  email: string;
  name?: string;
  company?: string;
  role_kind?: string;
};

export type ChatConversation = {
  id: number;
  updated_at: string;
  created_at: string;
  user: ChatUser;
  has_new_message?: boolean;
};

export type PaginatedConversations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatConversation[];
};

export type ChatAttachment = {
  id?: number;
  object_key: string;
  public_url?: string;
  content_type: string;
  file_name: string;
  size_bytes: number;
};

export type ChatMessage = {
  id: number;
  conversation_id: number;
  body: string;
  message_type: 'text' | 'text_with_attachment' | string;
  created_at: string;
  sender: ChatUser;
  attachments: ChatAttachment[];
};

export type PaginatedMessages = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
};

export type PresignedUrlResponse = {
  presigned_url: string;
  object_key: string;
  public_url: string;
  content_type: string;
};

export type BidConfig = {
  min_bid_increment: number;
};

export type AuctionConfig = {
  min_auction_duration_hours: number;
  max_auction_duration_hours: number;
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['Users', 'User', 'Auctions', 'Auction', 'Bids', 'Admins', 'Plans', 'Conversations', 'Messages', 'Subscriptions'],
  endpoints: (builder) => ({
    // ── Users ──────────────────────────────────────────────────────────────
    getUserList: builder.query<PaginatedUsers, { page?: number; search?: string; role?: string }>({
      query: ({ page = 1, search = '', role = '' } = {}) => ({
        url: `/api/admin/user/list/?page=${page}&page_size=8${search ? `&search=${search}` : ''}${role ? `&role=${role}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    getUser: builder.query<UserDetail, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),

    approveUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/approve/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'User'],
    }),

    suspendUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/suspend/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'User'],
    }),

    deleteUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    reactivateUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/reactivate/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'User'],
      // 
    }),

    upgradeToDealer: builder.mutation<any, number>({
      query: (userId) => ({
        url: `/api/admin/user/${userId}/upgrade-to-dealer/dev/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'User'],
    }),

    // ── Auctions ───────────────────────────────────────────────────────────
    getAuctionList: builder.query<PaginatedAuctions, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' } = {}) => ({
        url: `/api/admin/auctions/?page=${page}&page_size=8${search ? `&search=${encodeURIComponent(search)}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['Auctions'],
    }),

    getAuction: builder.query<AuctionDetail, number>({
      query: (auctionId) => ({
        url: `/api/admin/auctions/${auctionId}/`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'Auction', id }],
    }),

    getAuctionBids: builder.query<PaginatedBids, { auctionId: number; page?: number }>({
      query: ({ auctionId, page = 1 }) => ({
        url: `/api/admin/auctions/${auctionId}/bids/?page=${page}&page_size=8`,
        method: 'GET',
      }),
      providesTags: (_r, _e, { auctionId }) => [{ type: 'Bids', id: auctionId }],
    }),

    pauseAuction: builder.mutation<any, number>({
      query: (auctionId) => ({
        url: `/api/admin/auctions/${auctionId}/pause/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Auctions', 'Auction'],
    }),

    resumeAuction: builder.mutation<any, number>({
      query: (auctionId) => ({
        url: `/api/admin/auctions/${auctionId}/resume/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Auctions', 'Auction'],
    }),

    flagAuction: builder.mutation<void, { id: number; severity: string; behaviour_type: string; description: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/auctions/${id}/flag/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auctions', 'Auction'],
    }),

    unflagAuction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/auctions/${id}/unflag/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Auctions', 'Auction'],
    }),

    removeAuction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/auctions/${id}/remove/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auctions'],
    }),

    // ── Dashboard ─────────────────────────────────────────────────────────
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: '/api/admin/dashboard/stats/',
        method: 'GET',
      }),
    }),

    getAuctionTrends: builder.query<AuctionTrends, void>({
      query: () => ({
        url: '/api/admin/dashboard/auction-trends/',
        method: 'GET',
      }),
    }),

    getRevenueTrends: builder.query<RevenueTrends, void>({
      query: () => ({
        url: '/api/admin/dashboard/revenue-trends/',
        method: 'GET',
      }),
    }),

    getPlanBreakdown: builder.query<PlanBreakdown, void>({
      query: () => ({
        url: '/api/admin/dashboard/plan-breakdown/',
        method: 'GET',
      }),
    }),

    // ── Compliance ────────────────────────────────────────────────────────
    getAuditLogs: builder.query<PaginatedAuditLogs, { page?: number; pageSize?: number; search?: string }>({
      query: ({ page = 1, pageSize = 8, search = '' } = {}) => ({
        url: `/api/admin/compliance/audit-logs/?page=${page}&page_size=${pageSize}${search ? `&search=${encodeURIComponent(search)}&actor_email=${encodeURIComponent(search)}` : ''}`,
        method: 'GET',
      }),
    }),

    // ── Profile ───────────────────────────────────────────────────────────
    getMe: builder.query<AdminProfile, void>({
      query: () => ({
        url: '/api/admin/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateMe: builder.mutation<AdminProfile, Partial<AdminProfile>>({
      query: (body) => ({
        url: '/api/admin/me/update/',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: '/api/admin/me/change-password/',
        method: 'POST',
        body,
      }),
    }),

    // ── Support ───────────────────────────────────────────────────────────
    getSupportContact: builder.query<SupportContact, void>({
      query: () => ({
        url: '/api/admin/support-contact/',
        method: 'GET',
      }),
    }),

    updateSupportContact: builder.mutation<SupportContact, SupportContact>({
      query: (body) => ({
        url: '/api/admin/support-contact/',
        method: 'PUT',
        body,
      }),
    }),

    // ── Subscriptions ─────────────────────────────────────────────────────
    getSubscriptions: builder.query<PaginatedSubscriptions, { page?: number; pageSize?: number; search?: string }>({
      query: ({ page = 1, pageSize = 8, search = '' } = {}) => ({
        url: `/api/admin/subscriptions/?page=${page}&page_size=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
    }),

    getUserSubscription: builder.query<UserSubscriptionDetail, number>({
      query: (userId) => ({
        url: `/api/admin/subscriptions/${userId}/`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'Subscriptions', id }],
    }),

    changeUserPlan: builder.mutation<ChangePlanResponse, { userId: number; plan: string }>({
      query: ({ userId, plan }) => ({
        url: `/api/admin/subscriptions/${userId}/change-plan/`,
        method: 'PATCH',
        body: { plan },
      }),
      invalidatesTags: (result, error, { userId }) => [
        'Users', 
        'User', 
        'Subscriptions', 
        { type: 'Subscriptions', id: userId }
      ],
    }),

    getUserInvoices: builder.query<InvoiceItem[], number>({
      query: (userId) => ({
        url: `/api/admin/subscriptions/${userId}/invoices/`,
        method: 'GET',
      }),
    }),

    refundSubscription: builder.mutation<any, { userId: number; stripe_invoice_id: string; reason?: string }>({
      query: ({ userId, ...body }) => ({
        url: `/api/admin/subscriptions/${userId}/refund/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Subscriptions', id: userId }],
    }),

    // ── Plans ─────────────────────────────────────────────────────────────
    getPlans: builder.query<PlanItem[], void>({
      query: () => ({
        url: '/api/admin/plans/',
        method: 'GET',
      }),
      providesTags: ['Plans'],
    }),

    updatePlanPrice: builder.mutation<PlanItem, { plan: string; price: string }>({
      query: ({ plan, price }) => ({
        url: `/api/admin/plans/${encodeURIComponent(plan)}/price/`,
        method: 'PATCH',
        body: { price },
      }),
      invalidatesTags: ['Plans'],
    }),

    // ── Admin Management ────────────────────────────────────────────────────────
    getAdmins: builder.query<{ count: number; previous: string | null; next: string | null; results: AdminAccount[] }, { page?: number }>({
      query: ({ page = 1 } = {}) => `api/admin/list/?page=${page}&page_size=8`,
      providesTags: ['Admins'],
    }),

    createAdmin: builder.mutation<AdminAccount, Partial<AdminAccount> & { password?: string }>({
      query: (body) => ({
        url: 'api/admin/create/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    getFlaggedAuctions: builder.query<{ count: number; previous: string | null; next: string | null; results: FlaggedAuction[] }, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' } = {}) => `api/admin/auctions/flagged/?page=${page}&page_size=8${search ? `&search=${encodeURIComponent(search)}` : ''}`,
      providesTags: ['Auctions'],
    }),

    // ── Chat ─────────────────────────────────────────────────────────────
    getConversations: builder.query<PaginatedConversations, void>({
      query: () => ({
        url: '/api/admin/chat/conversations/',
        method: 'GET',
      }),
      providesTags: ['Conversations'],
    }),

    getMessages: builder.query<PaginatedMessages, number>({
      query: (conversationId) => ({
        url: `/api/admin/chat/conversations/${conversationId}/messages`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'Messages', id }],
    }),

    sendMessage: builder.mutation<ChatMessage, { conversationId: number; body: string; attachments?: ChatAttachment[] }>({
      query: ({ conversationId, body, attachments = [] }) => ({
        url: `/api/admin/chat/conversations/${conversationId}/messages/send/`,
        method: 'POST',
        body: { body, attachments },
      }),
      invalidatesTags: (_r, _e, { conversationId }) => [{ type: 'Messages', id: conversationId }, 'Conversations'],
    }),

    getPresignedUrl: builder.query<PresignedUrlResponse, { content_type: string; file_name: string }>({
      query: (params) => ({
        url: '/api/admin/chat/upload/presigned-url',
        method: 'GET',
        params,
      }),
    }),

    // ── Bid Config ───────────────────────────────────────────────────────────
    getBidConfig: builder.query<BidConfig, void>({
      query: () => ({
        url: '/api/admin/config/bid/',
        method: 'GET',
      }),
      providesTags: ['Auctions'],
    }),

    updateBidConfig: builder.mutation<BidConfig, { min_bid_increment: number }>({
      query: (body) => ({
        url: '/api/admin/config/bid/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auctions'],
    }),

    // ── Auction Config ────────────────────────────────────────────────────────
    getAuctionConfig: builder.query<AuctionConfig, void>({
      query: () => ({
        url: '/api/admin/config/auction/',
        method: 'GET',
      }),
      providesTags: ['Auctions'],
    }),

    updateAuctionConfig: builder.mutation<AuctionConfig, { min_auction_duration_hours: number; max_auction_duration_hours: number }>({
      query: (body) => ({
        url: '/api/admin/config/auction/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auctions'],
    }),
  }),
});

export type FlaggedAuction = AuctionListItem & {
  flag_severity: string;
  flag_behaviour_type: string;
  flag_description: string;
  flag_created_at: string;
};

export type AdminAccount = {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  full_name?: string;
  created_at: string;
};





export const {
  useGetUserListQuery,
  useGetUserQuery,
  useApproveUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useReactivateUserMutation,
  useUpgradeToDealerMutation,
  useGetAuctionListQuery,
  useGetAuctionQuery,
  useGetAuctionBidsQuery,
  usePauseAuctionMutation,
  useResumeAuctionMutation,
  useFlagAuctionMutation,
  useUnflagAuctionMutation,
  useRemoveAuctionMutation,
  useGetDashboardStatsQuery,
  useGetAuctionTrendsQuery,
  useGetRevenueTrendsQuery,
  useGetPlanBreakdownQuery,
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useGetSupportContactQuery,
  useUpdateSupportContactMutation,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useGetUserSubscriptionQuery,
  useChangeUserPlanMutation,
  useGetUserInvoicesQuery,
  useRefundSubscriptionMutation,
  useGetPlansQuery,
  useUpdatePlanPriceMutation,
  useGetAdminsQuery,
  useCreateAdminMutation,
  useGetFlaggedAuctionsQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useLazyGetPresignedUrlQuery,
  useGetBidConfigQuery,
  useUpdateBidConfigMutation,
  useGetAuctionConfigQuery,
  useUpdateAuctionConfigMutation,
} = adminApi;

