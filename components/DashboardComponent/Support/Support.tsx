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
  useUpdateSupportContactMutation 
} from "@/lib/adminApi";

type Ticket = {
  id: string;
  dealer: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in progress" | "resolved";
  assigned?: string;
  lastUpdated: string;
  messages?: Message[];
};

type Message = {
  sender: string;
  role: "dealer" | "admin";
  content: string;
  timestamp: string;
};

const mockTickets: Ticket[] = [
  {
    id: "t1",
    dealer: "Hans Mueller",
    title: "Payment processing issue",
    priority: "high",
    status: "in progress",
    assigned: "Super Admin",
    lastUpdated: "3/5/2026",
    messages: [
      {
        sender: "Hans Mueller",
        role: "dealer",
        content: "I am unable to process payment for the recent auction win.",
        timestamp: "3/5/2026, 2:30:00 PM",
      },
      {
        sender: "Super Admin",
        role: "admin",
        content: "Okay, wait for resolve",
        timestamp: "3/5/2026, 12:53:35 AM",
      },
    ],
  },
  {
    id: "t2",
    dealer: "Pierre Duboils",
    title: "Account verification question",
    priority: "medium",
    status: "in progress",
    assigned: "Manager Admin",
    lastUpdated: "3/2/2026",
    messages: [],
  },
];

export default function SupportMessagingCenter() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

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
                {mockTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedTicket?.id === ticket.id
                        ? "bg-gray-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                        : "bg-gray-900/50 border-gray-800 hover:bg-gray-900 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{ticket.dealer}</div>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <div className="text-sm text-gray-300 mb-1.5 line-clamp-1">{ticket.title}</div>

                    <div className="flex items-center justify-between text-xs">
                      <StatusBadge status={ticket.status} />
                      <div className="text-gray-500">{ticket.lastUpdated}</div>
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
          {selectedTicket && !showSettings ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
                <div>
                  <h2 className="font-semibold text-white">{selectedTicket.title}</h2>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {selectedTicket.dealer} • General Support
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-1.5 bg-blue-950/30 hover:bg-blue-950/50 border border-blue-900/50 text-blue-300 rounded-md text-xs font-medium transition">
                    Assign to Me
                  </button>
                  <button className="px-4 py-1.5 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/50 text-emerald-300 rounded-md text-xs font-medium transition flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Resolve
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {selectedTicket.messages?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 ${
                        msg.role === "admin"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                          : "bg-gray-800 border border-gray-700 text-gray-200"
                      }`}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${msg.role === "admin" ? "text-emerald-50" : "text-gray-400"}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {msg.role === "admin" ? "You" : msg.sender}
                        </span>
                        <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                      </div>
                      <div className="text-sm leading-relaxed">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-gray-800 bg-gray-950/50">
                <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus-within:border-emerald-500/50 transition-all shadow-inner">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 bg-transparent focus:outline-none text-sm text-white"
                  />
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-500">
                    <Paperclip size={18} />
                  </button>
                  <button className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-md active:scale-95">
                    <Send size={18} />
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

function PriorityBadge({ priority }: { priority: Ticket["priority"] }) {
  const colors = {
    high: "bg-red-950/50 text-red-400 border-red-900/50",
    medium: "bg-amber-950/50 text-amber-400 border-amber-900/50",
    low: "bg-blue-950/50 text-blue-400 border-blue-900/50",
  };

  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${colors[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: Ticket["status"] }) {
  const styles = {
    open: "bg-blue-950/30 text-blue-400",
    "in progress": "bg-amber-950/30 text-amber-400",
    resolved: "bg-emerald-950/30 text-emerald-400",
  };

  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}