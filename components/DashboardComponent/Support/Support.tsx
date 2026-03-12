// app/support/page.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Left Sidebar - Ticket List */}
        <div className="w-full md:w-96 border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold">Support & Messaging Center</h1>
            <p className="text-gray-400 text-sm mt-1">
              Dealer support tickets and live chat
            </p>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-600"
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
                    ? "bg-gray-800 border-gray-600"
                    : "bg-gray-900 border-gray-800 hover:bg-gray-850"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{ticket.dealer}</div>
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <div className="text-sm text-gray-300 mb-1.5">{ticket.title}</div>

                <div className="flex items-center justify-between text-xs">
                  <StatusBadge status={ticket.status} />
                  <div className="text-gray-500">{ticket.lastUpdated}</div>
                </div>

                {ticket.assigned && (
                  <div className="mt-2 text-xs text-gray-400">
                    Assigned to: {ticket.assigned}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Conversation View */}
        <div className="hidden md:flex flex-1 flex-col bg-gray-925">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selectedTicket.title}</h2>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {selectedTicket.dealer} • General
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-md text-sm transition">
                    Assign to Me
                  </button>
                  <button className="px-4 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-md text-sm transition flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Resolve
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
                      className={`max-w-[75%] rounded-lg p-3.5 ${
                        msg.role === "admin"
                          ? "bg-emerald-950/70 border border-emerald-900/50"
                          : "bg-gray-800 border border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            msg.role === "admin"
                              ? "bg-emerald-900/50 text-emerald-300"
                              : "bg-blue-950/70 text-blue-300"
                          }`}
                        >
                          {msg.sender} {msg.role === "dealer" ? "(dealer)" : "(admin)"}
                        </div>
                        <div className="text-xs text-gray-500">{msg.timestamp}</div>
                      </div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-gray-800">
                <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                  />
                  <button className="p-2 hover:bg-gray-800 rounded-md transition">
                    <Paperclip size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-md transition">
                    <Send size={18} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <Clock size={13} /> Message sent
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare size={64} className="mb-6 opacity-40" />
              <p className="text-lg font-medium">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Ticket["priority"] }) {
  const colors = {
    high: "bg-red-950 text-red-400 border-red-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    low: "bg-blue-950 text-blue-400 border-blue-800",
  };

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${colors[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: Ticket["status"] }) {
  const styles = {
    open: "bg-blue-950 text-blue-400 border-blue-800",
    "in progress": "bg-amber-950 text-amber-400 border-amber-800",
    resolved: "bg-emerald-950 text-emerald-400 border-emerald-800",
  };

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}