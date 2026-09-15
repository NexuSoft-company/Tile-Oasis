/**
 * Local-First Support Service
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 *
 * Supports:
 * - Offline-first player support ticket creation & local queueing
 * - Conversation history with user messages & admin replies
 * - Admin status transitions (OPEN, PENDING, RESOLVED)
 * - Internal admin notes
 * - Instant synchronization between player client and admin dashboard
 */

import {
  SupportTicket,
  SupportTicketMessage,
  SupportCategory,
  SupportTicketStatus,
} from '../../types/adminDashboard';

const SUPPORT_TICKETS_KEY = 'tile_oasis_support_tickets_v1';

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-9042',
    userId: 'player_oasis_77',
    userName: 'Aria Chen',
    userEmail: 'aria.chen.oasis@gmail.com',
    category: 'GAMEPLAY_HELP',
    subject: 'Tricky ice layer on Level 14',
    message: 'Hello, I reached Level 14 and cannot seem to unfreeze the lower corner tiles in time. Any tips on which booster works best here?',
    levelNumber: 14,
    status: 'PENDING',
    createdAt: Date.now() - 36 * 60 * 60 * 1000,
    updatedAt: Date.now() - 12 * 60 * 60 * 1000,
    internalNotes: ['Verified level layout: Magnet booster works best on frozen corner tiles.'],
    conversation: [
      {
        id: 'msg_1',
        sender: 'USER',
        senderName: 'Aria Chen',
        message: 'Hello, I reached Level 14 and cannot seem to unfreeze the lower corner tiles in time. Any tips on which booster works best here?',
        timestamp: Date.now() - 36 * 60 * 60 * 1000,
      },
      {
        id: 'msg_2',
        sender: 'ADMIN',
        senderName: 'Oasis Support Team',
        message: 'Hi Aria! Try matching the adjacent warm blossom tiles first to shatter the top ice layer. You can also use the Magnet booster to auto-clear 3 matches directly!',
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
      },
    ],
  },
  {
    id: 'TICK-9045',
    userId: 'player_oasis_120',
    userName: 'Kaelen Vance',
    userEmail: 'kaelen.vance@gamers.io',
    category: 'MISSING_ITEMS',
    subject: 'Rewarded ad did not award bonus coins',
    message: 'Watched the full 30s ad after finishing Level 8, but connection dipped at the last second and the 2x coin reward was not added to my wallet.',
    levelNumber: 8,
    status: 'OPEN',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    internalNotes: ['AdMob telemetry shows connection timeout at 28s. Recommended compensation: +200 Coins.'],
    conversation: [
      {
        id: 'msg_3',
        sender: 'USER',
        senderName: 'Kaelen Vance',
        message: 'Watched the full 30s ad after finishing Level 8, but connection dipped at the last second and the 2x coin reward was not added to my wallet.',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
      },
    ],
  },
  {
    id: 'TICK-9038',
    userId: 'player_oasis_44',
    userName: 'Seraphina Frost',
    userEmail: 'seraphina.oasis@cloud.net',
    category: 'FEEDBACK',
    subject: 'Love the new World 4 Rainforest music!',
    message: 'Just wanted to share feedback that the bamboo flute and ambient water drop SFX in World 4 are incredibly soothing! Fantastic art and sound design.',
    levelNumber: 31,
    status: 'RESOLVED',
    createdAt: Date.now() - 72 * 60 * 60 * 1000,
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
    internalNotes: ['Positive audio feedback passed to sound designer.'],
    conversation: [
      {
        id: 'msg_4',
        sender: 'USER',
        senderName: 'Seraphina Frost',
        message: 'Just wanted to share feedback that the bamboo flute and ambient water drop SFX in World 4 are incredibly soothing! Fantastic art and sound design.',
        timestamp: Date.now() - 72 * 60 * 60 * 1000,
      },
      {
        id: 'msg_5',
        sender: 'ADMIN',
        senderName: 'Oasis Community Team',
        message: 'Thank you so much Seraphina! The audio team is thrilled to hear this. Happy matching!',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
      },
    ],
  },
];

export class SupportService {
  private static instance: SupportService;
  private listeners: Array<(tickets: SupportTicket[]) => void> = [];

  private constructor() {
    this.initStorage();
  }

  public static getInstance(): SupportService {
    if (!SupportService.instance) {
      SupportService.instance = new SupportService();
    }
    return SupportService.instance;
  }

  private initStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (!localStorage.getItem(SUPPORT_TICKETS_KEY)) {
      localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(INITIAL_SUPPORT_TICKETS));
    }
  }

  public getAllTickets(): SupportTicket[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [...INITIAL_SUPPORT_TICKETS];
    }
    try {
      const raw = localStorage.getItem(SUPPORT_TICKETS_KEY);
      if (!raw) return [...INITIAL_SUPPORT_TICKETS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...INITIAL_SUPPORT_TICKETS];
    } catch {
      return [...INITIAL_SUPPORT_TICKETS];
    }
  }

  public saveTickets(tickets: SupportTicket[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets || []));
      this.notifyListeners(tickets || []);
    }
  }

  public subscribe(listener: (tickets: SupportTicket[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(tickets: SupportTicket[]): void {
    this.listeners.forEach((l) => l(tickets));
  }

  /**
   * Player Submits Support Ticket (Local-first)
   */
  public submitTicket(params: {
    userId: string;
    userName: string;
    userEmail?: string;
    category: SupportCategory;
    subject: string;
    message: string;
    screenshotUrl?: string;
    levelNumber?: number;
  }): SupportTicket {
    const tickets = this.getAllTickets();
    const newId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: newId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      category: params.category,
      subject: params.subject,
      message: params.message,
      screenshotUrl: params.screenshotUrl,
      levelNumber: params.levelNumber,
      status: 'OPEN',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      internalNotes: [],
      conversation: [
        {
          id: `msg_${Date.now()}`,
          sender: 'USER',
          senderName: params.userName,
          message: params.message,
          timestamp: Date.now(),
        },
      ],
    };

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  /**
   * Admin Replies to a Support Ticket
   */
  public replyToTicket(
    ticketId: string,
    adminName: string,
    message: string,
    newStatus?: SupportTicketStatus
  ): boolean {
    const tickets = this.getAllTickets();
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return false;

    const newMessage: SupportTicketMessage = {
      id: `msg_adm_${Date.now()}`,
      sender: 'ADMIN',
      senderName: adminName,
      message,
      timestamp: Date.now(),
    };

    ticket.conversation.push(newMessage);
    ticket.updatedAt = Date.now();
    if (newStatus) {
      ticket.status = newStatus;
    } else if (ticket.status === 'OPEN') {
      ticket.status = 'PENDING';
    }

    this.saveTickets(tickets);
    return true;
  }

  /**
   * Update Ticket Status (OPEN, PENDING, RESOLVED)
   */
  public updateStatus(ticketId: string, status: SupportTicketStatus): boolean {
    const tickets = this.getAllTickets();
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return false;

    ticket.status = status;
    ticket.updatedAt = Date.now();
    this.saveTickets(tickets);
    return true;
  }

  /**
   * Add Internal Note (Only visible to admins)
   */
  public addInternalNote(ticketId: string, note: string): boolean {
    const tickets = this.getAllTickets();
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return false;

    if (!ticket.internalNotes) {
      ticket.internalNotes = [];
    }
    ticket.internalNotes.push(note);
    ticket.updatedAt = Date.now();
    this.saveTickets(tickets);
    return true;
  }

  /**
   * Get tickets for a specific player
   */
  public getTicketsForUser(userId: string): SupportTicket[] {
    const all = this.getAllTickets();
    return all.filter((t) => t.userId === userId);
  }
}

export const globalSupportService = SupportService.getInstance();
