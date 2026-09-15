import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

class LocalNotificationService {
  private initialized = false;

  private readonly MESSAGES = [
    "New rewards have arrived! 🎁 Tap to claim them now.",
    "A new challenge is waiting for you! 🏆 Come back and play.",
    "New levels have been added! 🧩 Continue your tile matching journey.",
    "Your Sanctuary misses you! 🌸 Come decorate and relax.",
    "Don't lose your streak! 🔥 Play a quick level now.",
    "Free boosters are available! ⚡ Open the app to grab them."
  ];

  public async initialize() {
    if (this.initialized || !Capacitor.isNativePlatform()) return;

    try {
      // Request permissions for Android 13+ and iOS
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        this.initialized = true;
        this.setupLifecycleListeners();
      } else {
        console.warn('Local Notifications permission denied.');
      }
    } catch (error) {
      console.error('Error initializing local notifications:', error);
    }
  }

  private setupLifecycleListeners() {
    // When app goes to background, schedule the inactive notifications
    App.addListener('appStateChange', async (state) => {
      if (!state.isActive) {
        await this.scheduleInactivityNotifications();
      } else {
        // App is opened, cancel the scheduled notifications
        await this.cancelAllNotifications();
      }
    });
  }

  private getRandomMessage(): string {
    return this.MESSAGES[Math.floor(Math.random() * this.MESSAGES.length)];
  }

  public async scheduleInactivityNotifications() {
    if (!this.initialized || !Capacitor.isNativePlatform()) return;

    try {
      // First, ensure no old notifications are lingering
      await this.cancelAllNotifications();

      const notificationsToSchedule: ScheduleOptions['notifications'] = [];
      const now = new Date();

      // Schedule for every 4 hours up to 48 hours (12 notifications)
      for (let i = 1; i <= 12; i++) {
        const triggerDate = new Date(now.getTime() + i * 4 * 60 * 60 * 1000); // i * 4 hours
        
        notificationsToSchedule.push({
          id: i * 1000,
          title: "Tile Oasis: Sanctuary Match",
          body: this.getRandomMessage(),
          schedule: { at: triggerDate },
          sound: undefined,
          autoCancel: true,
          smallIcon: "ic_stat_icon", // default fallback
        });
      }

      await LocalNotifications.schedule({
        notifications: notificationsToSchedule
      });
      
      console.log('Scheduled inactivity notifications (every 4 hours)');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  public async cancelAllNotifications() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }
}

export const globalNotificationService = new LocalNotificationService();
