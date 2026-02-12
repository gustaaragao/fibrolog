import { storage } from "@/utils/storage";
import { api } from "@/services/api";
import { notificationService } from "./notification-service";

export type ReminderType = "geral" | "medicamento" | "exame";

export interface Reminder {
  id: string;
  titulo: string;
  tipo: ReminderType;
  hora: number;
  minuto: number;
  ativo: boolean;
  // Campos condicionais
  dosagem?: string;      // Para medicamentos
  intervalo?: number;    // Para medicamentos (em horas)
  dataExame?: string;    // Para exames (ISO string)
  notificationIds: string[]; // Suporte a múltiplas notificações
  // Sincronização
  synced: boolean;
  backendId?: string;
}

const STORAGE_KEY = "fibrolog_reminders";

export const reminderService = {
  /**
   * Busca todos os lembretes do storage
   */
  async getReminders(): Promise<Reminder[]> {
    const data = await storage.getItemAsync(STORAGE_KEY);
    if (!data) return [];
    try {
      const reminders = JSON.parse(data) as any[];
      // Migração: garante campos novos em lembretes antigos
      return reminders.map(r => ({
        ...r,
        tipo: r.tipo || "geral",
        notificationIds: r.notificationIds || (r.notificationId ? [r.notificationId] : []),
        synced: r.synced !== undefined ? r.synced : true, // Assume true para antigos se não quiser forçar sync imediato, ou false se quiser
        backendId: r.backendId || undefined
      }));
    } catch {
      return [];
    }
  },

  /**
   * Busca lembretes do servidor
   */
  async getRemindersFromServer(): Promise<Reminder[]> {
    try {
      const serverReminders = await api.get<any[]>("/pacientes/lembretes/");
      return serverReminders.map(r => ({
        id: r.id.toString(),
        titulo: r.titulo,
        tipo: r.tipo,
        hora: r.hora,
        minuto: r.minuto,
        ativo: r.ativo,
        dosagem: r.dosagem,
        intervalo: r.intervalo,
        dataExame: r.data_exame,
        notificationIds: [], // Notificações são locais
        synced: true,
        backendId: r.id.toString()
      }));
    } catch (error) {
      console.error("Erro ao buscar lembretes do servidor:", error);
      throw error;
    }
  },

  /**
   * Sincroniza lembretes locais com o servidor (Reconciliação)
   */
  async syncLocalRemindersWithServer(): Promise<Reminder[]> {
    try {
      // 1. Busca do servidor
      const serverReminders = await this.getRemindersFromServer();
      
      // 2. Busca locais
      const localReminders = await this.getReminders();
      
      // 3. Reconciliação (Estratégia: Servidor ganha para IDs existentes, 
      // mas mantemos locais que ainda não foram sincronizados)
      const reconciled: Reminder[] = [...serverReminders];
      
      for (const local of localReminders) {
        // Se o item local não tem backendId, ele ainda não foi enviado ao servidor
        if (!local.backendId) {
          // Tenta enviar agora
          const syncedLocal = await this.syncReminderWithBackend(local);
          reconciled.push(syncedLocal);
        } else {
          // Se já tem backendId, o servidor já tem uma versão.
          // Como o servidor é a fonte da verdade para o sync de boot, 
          // já o incluímos na inicialização de 'reconciled'.
        }
      }
      
      // 4. Salva o resultado final localmente
      await this.saveReminders(reconciled);
      
      // 5. Reagenda todas as notificações locais
      await this.syncNotifications();
      
      return reconciled;
    } catch (error) {
      console.error("Erro na reconciliação de lembretes:", error);
      return this.getReminders(); // Retorna locais se falhar
    }
  },

  /**
   * Salva a lista de lembretes no storage
   */
  async saveReminders(reminders: Reminder[]): Promise<void> {
    await storage.setItemAsync(STORAGE_KEY, JSON.stringify(reminders));
  },

  /**
   * Sincroniza um lembrete individual com o backend
   */
  async syncReminderWithBackend(reminder: Reminder): Promise<Reminder> {
    try {
      if (reminder.backendId) {
        // Atualiza lembrete existente
        await api.patch(`/pacientes/lembretes/${reminder.backendId}`, {
          titulo: reminder.titulo,
          tipo: reminder.tipo,
          hora: reminder.hora,
          minuto: reminder.minuto,
          ativo: reminder.ativo,
          dosagem: reminder.dosagem,
          intervalo: reminder.intervalo,
          data_exame: reminder.dataExame
        });
        return { ...reminder, synced: true };
      } else {
        // Cria novo lembrete
        const response = await api.post<any>("/pacientes/lembretes/", {
          id: reminder.id, // Envia o ID local
          titulo: reminder.titulo,
          tipo: reminder.tipo,
          hora: reminder.hora,
          minuto: reminder.minuto,
          ativo: reminder.ativo,
          dosagem: reminder.dosagem,
          intervalo: reminder.intervalo,
          data_exame: reminder.dataExame
        });
        return { ...reminder, synced: true, backendId: response.id?.toString() };
      }
    } catch (error) {
      console.warn("Falha na sincronização em background:", error);
      return { ...reminder, synced: false };
    }
  },

  /**
   * Adiciona um novo lembrete com metadados expandidos
   */
  async addReminder(
    titulo: string, 
    tipo: ReminderType,
    hora: number, 
    minuto: number,
    metadata: { dosagem?: string; intervalo?: number; dataExame?: string } = {}
  ): Promise<Reminder> {
    const reminders = await this.getReminders();
    
    let newReminder: Reminder = {
      id: Date.now().toString(),
      titulo,
      tipo,
      hora,
      minuto,
      ativo: true,
      ...metadata,
      notificationIds: [],
      synced: false
    };

    // Solicita permissão e agenda se estiver ativo
    const hasPermission = await notificationService.requestPermissions();
    if (hasPermission) {
      const ids = await notificationService.scheduleReminderNotifications(newReminder);
      newReminder.notificationIds = ids;
    }

    // Salva localmente primeiro
    reminders.push(newReminder);
    await this.saveReminders(reminders);

    // Tenta sincronizar em background
    newReminder = await this.syncReminderWithBackend(newReminder);
    
    // Se sincronizou (ou falhou mas atualizou flags), salva novamente
    const index = reminders.findIndex(r => r.id === newReminder.id);
    if (index !== -1) {
      reminders[index] = newReminder;
      await this.saveReminders(reminders);
    }

    return newReminder;
  },

  /**
   * Alterna o estado ativo/inativo de um lembrete
   */
  async toggleReminder(id: string): Promise<Reminder[]> {
    const reminders = await this.getReminders();
    const index = reminders.findIndex((r) => r.id === id);
    
    if (index !== -1) {
      let reminder = reminders[index];
      reminder.ativo = !reminder.ativo;

      if (reminder.ativo) {
        const hasPermission = await notificationService.requestPermissions();
        if (hasPermission) {
          const ids = await notificationService.scheduleReminderNotifications(reminder);
          reminder.notificationIds = ids;
        }
      } else {
        await notificationService.cancelNotificationByReminderId(reminder.id);
        reminder.notificationIds = [];
      }

      // Salva localmente primeiro
      await this.saveReminders(reminders);

      // Tenta sincronizar em background
      reminder = await this.syncReminderWithBackend(reminder);
      reminders[index] = reminder;
      await this.saveReminders(reminders);
    }
    
    return reminders;
  },

  /**
   * Remove um lembrete
   */
  async deleteReminder(id: string): Promise<Reminder[]> {
    let reminders = await this.getReminders();
    const reminderToDelete = reminders.find(r => r.id === id);
    
    // Cancela notificações associadas
    await notificationService.cancelNotificationByReminderId(id);
    
    // Tenta deletar no servidor se tiver backendId
    if (reminderToDelete?.backendId) {
      try {
        await api.delete(`/pacientes/lembretes/${reminderToDelete.backendId}`);
      } catch (error) {
        console.warn("Erro ao deletar lembrete no servidor:", error);
        // Prossegue com a remoção local mesmo se falhar no servidor
        // Em uma implementação mais robusta, poderíamos marcar para deleção posterior
      }
    }
    
    reminders = reminders.filter((r) => r.id !== id);
    await this.saveReminders(reminders);
    return reminders;
  },

  /**
   * Sincroniza todas as notificações baseadas nos lembretes ativos
   */
  async syncNotifications(): Promise<void> {
    const reminders = await this.getReminders();
    const hasPermission = await notificationService.requestPermissions();
    
    if (!hasPermission) return;

    for (const reminder of reminders) {
      if (reminder.ativo) {
        const ids = await notificationService.scheduleReminderNotifications(reminder);
        reminder.notificationIds = ids;
      } else {
        await notificationService.cancelNotificationByReminderId(reminder.id);
        reminder.notificationIds = [];
      }
    }
    
    await this.saveReminders(reminders);
  }
};
