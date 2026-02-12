import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Reminder } from "./reminder-service";

// Configura como as notificações devem ser tratadas quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  /**
   * Solicita permissão para enviar notificações
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice && Platform.OS !== "web") {
      console.warn("Notificações não funcionam em simuladores Android/iOS reais.");
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reminders", {
        name: "Lembretes",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#D330AA",
      });
    }

    return true;
  },

  /**
   * Agenda notificações para um lembrete baseado em seu tipo e metadados
   */
  async scheduleReminderNotifications(reminder: Reminder): Promise<string[]> {
    if (Platform.OS === "web") {
      console.log("Simulando agendamento na Web para:", reminder.titulo);
      return [`web-notif-${reminder.id}`];
    }

    // Limpa agendamentos anteriores para este lembrete
    await this.cancelNotificationByReminderId(reminder.id);

    const notificationIds: string[] = [];
    const baseContent = {
      title: reminder.tipo === "medicamento" ? "Hora do Remédio" : 
             reminder.tipo === "exame" ? "Lembrete de Exame" : "Lembrete FibroLog",
      body: reminder.tipo === "medicamento" && reminder.dosagem ? 
            `${reminder.titulo} - ${reminder.dosagem}` : reminder.titulo,
      data: { reminderId: reminder.id },
      sound: true,
    };

    if (reminder.tipo === "medicamento" && reminder.intervalo) {
      // Para medicamentos com intervalo, agendamos múltiplos horários no dia
      const timesPerDay = Math.floor(24 / reminder.intervalo);
      for (let i = 0; i < timesPerDay; i++) {
        const hour = (reminder.hora + (i * reminder.intervalo)) % 24;
        const id = await Notifications.scheduleNotificationAsync({
          content: baseContent,
          trigger: {
            hour,
            minute: reminder.minuto,
            repeats: true,
          } as Notifications.DailyNotificationTrigger,
        });
        notificationIds.push(id);
      }
    } else if (reminder.tipo === "exame" && reminder.dataExame) {
      // Para exames, agendamos uma data e hora específica
      const date = new Date(reminder.dataExame);
      const id = await Notifications.scheduleNotificationAsync({
        content: baseContent,
        trigger: {
          date,
        } as Notifications.CalendarNotificationTrigger,
      });
      notificationIds.push(id);
    } else {
      // Geral ou Medicamento sem intervalo (uma vez ao dia)
      const id = await Notifications.scheduleNotificationAsync({
        content: baseContent,
        trigger: {
          hour: reminder.hora,
          minute: reminder.minuto,
          repeats: true,
        } as Notifications.DailyNotificationTrigger,
      });
      notificationIds.push(id);
    }

    return notificationIds;
  },

  /**
   * Agenda uma notificação diária (Legado - mantido para compatibilidade se necessário)
   */
  async scheduleDailyNotification(
    id: string,
    title: string,
    body: string,
    hour: number,
    minute: number
  ): Promise<string> {
    if (Platform.OS === "web") return `web-notif-${id}`;
    await this.cancelNotificationByReminderId(id);
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { reminderId: id }, sound: true },
      trigger: { hour, minute, repeats: true } as Notifications.DailyNotificationTrigger,
    });
  },

  /**
   * Cancela uma notificação específica pelo notificationId do Expo
   */
  async cancelNotification(notificationId: string) {
    if (Platform.OS === "web") return;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  /**
   * Cancela notificações que possuam o ID do lembrete nos dados
   */
  async cancelNotificationByReminderId(reminderId: string) {
    if (Platform.OS === "web") return;
    
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduled) {
        if (notification.content.data?.reminderId === reminderId) {
          await Notifications.cancelScheduledNotificationAsync(
            notification.identifier
          );
        }
      }
    } catch (error) {
      console.warn("Erro ao buscar notificações agendadas:", error);
    }
  },

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllNotifications() {
    if (Platform.OS === "web") return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
