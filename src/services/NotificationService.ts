import { GameNotification } from '../types/metaProgression';

type NotificationListener = (notification: GameNotification) => void;

export class NotificationService {
  private static instance: NotificationService;
  private listeners: Set<NotificationListener> = new Set();
  private notificationHistory: GameNotification[] = [];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notify(
    type: GameNotification['type'],
    title: string,
    message: string
  ): GameNotification {
    const notification: GameNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
    };

    this.notificationHistory.push(notification);
    this.listeners.forEach((listener) => listener(notification));
    return notification;
  }

  public getHistory(): GameNotification[] {
    return [...this.notificationHistory];
  }

  public clearHistory(): void {
    this.notificationHistory = [];
  }
}

export const globalNotificationService = NotificationService.getInstance();
