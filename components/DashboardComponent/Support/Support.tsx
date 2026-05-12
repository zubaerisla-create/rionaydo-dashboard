"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Paperclip,
  Send,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Settings,
  Mail,
  Phone,
  Save,
  Loader2,
} from "lucide-react";
import {
  useGetSupportContactQuery,
  useUpdateSupportContactMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useLazyGetPresignedUrlQuery,
  ChatConversation,
  ChatMessage,
  ChatAttachment,
} from "@/lib/adminApi";
import { format } from "date-fns";

export default function SupportMessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // RTK Query Hooks
  const { data: conversationsData, isLoading: isConversationsLoading } = useGetConversationsQuery();
  const { data: messagesData, isLoading: isMessagesLoading } = useGetMessagesQuery(selectedConversation?.id as number, {
    skip: !selectedConversation?.id,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [getPresignedUrl] = useLazyGetPresignedUrlQuery();

  // Support Contact API
  const { data: supportInfo, isLoading: infoLoading } = useGetSupportContactQuery();
  const [updateContact, { isLoading: isUpdating }] = useUpdateSupportContactMutation();

  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    if (supportInfo) {
      setSupportEmail(supportInfo.support_email);
      setSupportPhone(supportInfo.support_phone);
    }
  }, [supportInfo]);

  const handleUpdateContact = async () => {
    try {
      await updateContact({
        support_email: supportEmail,
        support_phone: supportPhone
      }).unwrap();
      alert("Support contact updated successfully!");
    } catch (err) {
      alert("Failed to update support contact.");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        body: messageInput,
        attachments: [],
      }).unwrap();
      setMessageInput("");
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    setIsUploading(true);
    try {
      const { data: presignedData } = await getPresignedUrl({
        content_type: file.type || "application/octet-stream",
        file_name: file.name,
      });

      if (!presignedData) throw new Error("Failed to get upload URL");

      const uploadRes = await fetch(presignedData.presigned_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");

      const attachment: ChatAttachment = {
        object_key: presignedData.object_key,
        file_name: file.name,
        content_type: file.type || "application/octet-stream",
        size_bytes: file.size,
      };

      await sendMessage({
        conversationId: selectedConversation.id,
        body: "Sent an attachment",
        attachments: [attachment],
      }).unwrap();

    } catch (err) {
      console.error(err);
      alert("Failed to upload file and send message.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PP p");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Left Sidebar - Ticket List */}
        <div className="w-full md:w-96 border-r border-gray-800 flex flex-col bg-gray-950">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Support Center</h1>
              <p className="text-gray-400 text-xs mt-1">
                Dealer tickets and live chat
              </p>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition ${showSettings ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              <Settings size={18} />
            </button>
          </div>

          {!showSettings ? (
            <>
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-700"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {isConversationsLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-500" /></div>
                ) : conversationsData?.results.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedConversation?.id === conversation.id
                        ? "bg-gray-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                        : "bg-gray-900/50 border-gray-800 hover:bg-gray-900 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm truncate">{conversation.user.email}</div>
                      {/* Optional badges can go here if the API provides status */}
                    </div>

                    <div className="text-sm text-gray-300 mb-1.5 line-clamp-1">Conversation #{conversation.id}</div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="text-gray-500">{formatDate(conversation.updated_at)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Contact Settings</h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Mail size={12} /> Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    placeholder="support@rionaydo.ch"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Phone size={12} /> Support Phone
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                    placeholder="+41 00 000 00 00"
                  />
                </div>

                <button
                  onClick={handleUpdateContact}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition shadow-md"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Conversation View */}
        <div className="hidden md:flex flex-1 flex-col bg-[#0d0d0f]">
          {selectedConversation && !showSettings ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
                <div>
                  <h2 className="font-semibold text-white">Conversation #{selectedConversation.id}</h2>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {selectedConversation.user.email}
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Additional header actions can be placed here */}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col-reverse">
                {/* Assuming results are ordered latest first, otherwise we would need to reverse them here */}
                {isMessagesLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-500" /></div>
                ) : messagesData?.results.map((msg) => {
                  const isAdmin = msg.sender.role_kind === "admin" || msg.sender.role_kind === "super_admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-4 ${
                          isAdmin
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                            : "bg-gray-800 border border-gray-700 text-gray-200"
                        }`}
                      >
                        <div className={`flex items-center gap-2 mb-2 ${isAdmin ? "text-emerald-50" : "text-gray-400"}`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {isAdmin ? "You" : msg.sender.email}
                          </span>
                          <span className="text-[10px] opacity-60">{formatDate(msg.created_at)}</span>
                        </div>
                        <div className="text-sm leading-relaxed">{msg.body}</div>
                        
                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.attachments.map((att, i) => (
                              <a 
                                key={i} 
                                href={att.public_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-2 rounded border text-xs ${
                                  isAdmin ? "border-emerald-500 bg-emerald-700/50 text-white hover:bg-emerald-700" : "border-gray-700 bg-gray-900 hover:bg-gray-800"
                                } transition`}
                              >
                                <Paperclip size={14} />
                                <span className="truncate max-w-[200px]">{att.file_name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-gray-800 bg-gray-950/50">
                <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus-within:border-emerald-500/50 transition-all shadow-inner">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response..."
                    className="flex-1 bg-transparent focus:outline-none text-sm text-white disabled:opacity-50"
                    disabled={isSending || isUploading}
                  />
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="file" 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isSending || isUploading}
                    />
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-500 disabled:opacity-50">
                      {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={isSending || isUploading || !messageInput.trim()}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <div className="bg-gray-900 p-8 rounded-full mb-6 border border-gray-800">
                <MessageSquare size={48} className="opacity-20" />
              </div>
              <p className="text-lg font-medium text-gray-400">
                {showSettings ? "Manage Support Contact Information" : "Select a ticket to start messaging"}
              </p>
              <p className="text-sm max-w-xs text-center mt-2 opacity-60">
                {showSettings ? "Updates will be visible to all dealers in their support section." : "View and respond to dealer inquiries in real-time."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Removed unused mock Badge functions