const db = require('../config/database');

class SchedulerService {
    /**
     * Generate medication schedules based on frequency
     * @param {number} patientId 
     * @param {number} treatmentId 
     * @param {string} frequency - enum('Once daily', 'Twice daily', etc.)
     * @param {string} startDate - YYYY-MM-DD
     * @param {string} endDate - YYYY-MM-DD (optional)
     * @returns {Promise<number>} Number of schedules created
     */
    static async generateSchedule(patientId, treatmentId, frequency, startDate, endDate) {
        try {
            // IMPORTANT: Utiliser l'heure actuelle pour la première dose
            const now = new Date();
            const start = new Date(startDate);
            
            // Si la date de début est aujourd'hui, utiliser l'heure actuelle
            // Sinon, utiliser minuit pour les jours futurs
            const isToday = start.toDateString() === now.toDateString();
            
            if (isToday) {
                // Aujourd'hui : commencer à l'heure actuelle
                start.setHours(now.getHours(), now.getMinutes(), 0, 0);
                console.log(`📅 Today's treatment: starting at ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')}`);
            } else {
                // Jours futurs : commencer à minuit
                start.setHours(0, 0, 0, 0);
            }
            
            let end;
            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            } else {
                end = new Date(start);
                end.setDate(start.getDate() + 30);
                end.setHours(23, 59, 59, 999);
            }

            console.log(`📅 Generating schedule from ${start.toISOString()} to ${end.toISOString()}`);

            // Calculer les horaires en fonction de la fréquence
            const times = this._calculateTimes(frequency, start);
            
            if (times.length === 0) {
                console.log(`No schedule generated for PRN medication: ${frequency}`);
                return 0;
            }

            console.log(`📋 Times for ${frequency}:`, times);

            const schedules = [];
            let currentDate = new Date(start);
            currentDate.setHours(0, 0, 0, 0); // Reset to midnight for day iteration

            // Pour chaque jour
            while (currentDate <= end) {
                // Pour chaque horaire du jour
                for (const time of times) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const scheduledTime = new Date(currentDate);
                    scheduledTime.setHours(hours, minutes, 0, 0);

                    // Pour aujourd'hui, ne pas programmer des horaires passés
                    const today = new Date();
                    if (scheduledTime.toDateString() === today.toDateString()) {
                        if (scheduledTime <= today) {
                            console.log(`⏰ Skipping past time for today: ${scheduledTime.getHours()}:${String(scheduledTime.getMinutes()).padStart(2, '0')}`);
                            continue;
                        }
                    }

                    schedules.push([
                        patientId,
                        treatmentId,
                        scheduledTime,
                        'SCHEDULED'
                    ]);
                    
                    console.log(`✅ Scheduled: ${scheduledTime.toLocaleString()}`);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (schedules.length > 0) {
                const query = 'INSERT INTO medication_schedules (patient_id, treatment_id, scheduled_date_time, status) VALUES ?';
                const [result] = await db.query(query, [schedules]);
                console.log(`✅ Generated ${schedules.length} schedules for treatment ${treatmentId}`);
                
                // Créer une notification pour la première dose
                if (schedules.length > 0) {
                    const firstSchedule = schedules[0];
                    const firstTime = new Date(firstSchedule[2]);
                    
                    // Récupérer le nom du médicament
                    const [treatmentInfo] = await db.execute(
                        'SELECT medication_name FROM treatments WHERE id = ?',
                        [treatmentId]
                    );
                    
                    const medicationName = treatmentInfo[0]?.medication_name || 'médicament';
                    
                    // Créer une notification pour le rappel de la première dose
                    const NotificationService = require('./notificationService');
                    await NotificationService.createNotification(
                        patientId,
                        'reminder',
                        '💊 Premier rappel',
                        `Votre première dose de ${medicationName} est prévue à ${firstTime.getHours()}:${String(firstTime.getMinutes()).padStart(2, '0')}`,
                        { 
                            treatmentId, 
                            schedule_id: firstSchedule[0],
                            type: 'first_dose' 
                        }
                    );
                }
                
                return schedules.length;
            }
            
            return 0;
            
        } catch (error) {
            console.error('❌ Error generating schedule:', error);
            throw error;
        }
    }

    /**
     * Calculer les horaires en fonction de la fréquence
     * @param {string} frequency 
     * @param {Date} startDate 
     * @returns {Array<string>} Liste des horaires au format "HH:MM"
     */
    static _calculateTimes(frequency, startDate) {
        const times = [];
        
        // Heure de début (prendre l'heure de la première dose)
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        
        // Fonction pour formater l'heure
        const formatTime = (hour, minute) => {
            return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        };
        
        console.log(`⏰ Calculating times based on start hour: ${startHour}:${String(startMinute).padStart(2, '0')}`);
        
        switch (frequency) {
            case 'Once daily':
                times.push(formatTime(startHour, startMinute));
                break;
                
            case 'Twice daily':
                times.push(formatTime(startHour, startMinute));
                // Deuxième dose 12 heures plus tard
                const hour2 = (startHour + 12) % 24;
                times.push(formatTime(hour2, startMinute));
                break;
                
            case 'Three times daily':
                times.push(formatTime(startHour, startMinute));
                // Toutes les 8 heures
                const hour2_3 = (startHour + 8) % 24;
                const hour3_3 = (startHour + 16) % 24;
                times.push(formatTime(hour2_3, startMinute));
                times.push(formatTime(hour3_3, startMinute));
                break;
                
            case 'Four times daily':
                times.push(formatTime(startHour, startMinute));
                // Toutes les 6 heures
                const hour2_4 = (startHour + 6) % 24;
                const hour3_4 = (startHour + 12) % 24;
                const hour4_4 = (startHour + 18) % 24;
                times.push(formatTime(hour2_4, startMinute));
                times.push(formatTime(hour3_4, startMinute));
                times.push(formatTime(hour4_4, startMinute));
                break;
                
            case 'Every 12 hours':
                times.push(formatTime(startHour, startMinute));
                const hour12 = (startHour + 12) % 24;
                times.push(formatTime(hour12, startMinute));
                break;
                
            case 'Every 8 hours':
                times.push(formatTime(startHour, startMinute));
                const hour8_2 = (startHour + 8) % 24;
                const hour8_3 = (startHour + 16) % 24;
                times.push(formatTime(hour8_2, startMinute));
                times.push(formatTime(hour8_3, startMinute));
                break;
                
            case 'Every 6 hours':
                times.push(formatTime(startHour, startMinute));
                const hour6_2 = (startHour + 6) % 24;
                const hour6_3 = (startHour + 12) % 24;
                const hour6_4 = (startHour + 18) % 24;
                times.push(formatTime(hour6_2, startMinute));
                times.push(formatTime(hour6_3, startMinute));
                times.push(formatTime(hour6_4, startMinute));
                break;
                
            case 'As needed':
                // Pas d'horaire fixe
                break;
                
            default:
                // Par défaut, une fois par jour à l'heure de début
                times.push(formatTime(startHour, startMinute));
        }
        
        // Trier les horaires
        times.sort((a, b) => {
            const [h1, m1] = a.split(':').map(Number);
            const [h2, m2] = b.split(':').map(Number);
            return (h1 * 60 + m1) - (h2 * 60 + m2);
        });
        
        return times;
    }

    /**
     * Mark a medication as taken
     * @param {number} scheduleId 
     * @returns {Promise<boolean>} Success status
     */
    static async markAsTaken(scheduleId) {
        try {
            const [result] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'TAKEN' 
                 WHERE id = ? AND status = 'SCHEDULED'`,
                [scheduleId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error marking as taken:', error);
            throw error;
        }
    }

    /**
     * Mark all past scheduled medications as missed
     * @returns {Promise<number>} Number of doses marked as missed
     */
    static async markMissedDoses() {
        try {
            const [result] = await db.execute(
                `UPDATE medication_schedules 
                 SET status = 'MISSED' 
                 WHERE status = 'SCHEDULED' 
                 AND scheduled_date_time < NOW()`
            );
            console.log(`Marked ${result.affectedRows} doses as missed`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error marking missed doses:', error);
            throw error;
        }
    }

    /**
     * Get today's schedule for a patient
     * @param {number} patientId 
     * @returns {Promise<Array>} Today's medications
     */
    static async getTodaySchedule(patientId) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name as condition_name
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                 WHERE ms.patient_id = ? 
                 AND DATE(ms.scheduled_date_time) = CURDATE()
                 ORDER BY ms.scheduled_date_time ASC`,
                [patientId]
            );
            return rows;
        } catch (error) {
            console.error('Error getting today schedule:', error);
            throw error;
        }
    }

    /**
     * Get upcoming doses for a patient
     * @param {number} patientId 
     * @param {number} limit 
     * @returns {Promise<Array>} Upcoming medications
     */
    static async getUpcomingDoses(patientId, limit = 5) {
        try {
            const [rows] = await db.execute(
                `SELECT ms.*, t.medication_name, t.dosage, c.name as condition_name
                 FROM medication_schedules ms
                 JOIN treatments t ON ms.treatment_id = t.id
                 LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                 WHERE ms.patient_id = ? 
                 AND ms.scheduled_date_time > NOW()
                 AND ms.status = 'SCHEDULED'
                 ORDER BY ms.scheduled_date_time ASC
                 LIMIT ?`,
                [patientId, limit]
            );
            return rows;
        } catch (error) {
            console.error('Error getting upcoming doses:', error);
            throw error;
        }
    }

    /**
     * Clear future schedules for a treatment
     * @param {number} treatmentId 
     * @returns {Promise<number>} Number of schedules deleted
     */
    static async clearFutureSchedules(treatmentId) {
        try {
            const [result] = await db.execute(
                `DELETE FROM medication_schedules 
                 WHERE treatment_id = ? 
                 AND scheduled_date_time > NOW() 
                 AND status = 'SCHEDULED'`,
                [treatmentId]
            );
            console.log(`Cleared ${result.affectedRows} future schedules for treatment ${treatmentId}`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error clearing future schedules:', error);
            throw error;
        }
    }

    /**
     * Get adherence statistics for a patient
     * @param {number} patientId 
     * @param {number} days 
     * @returns {Promise<Object>} Adherence stats
     */
    static async getAdherenceStats(patientId, days = 30) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as taken,
                    SUM(CASE WHEN status = 'MISSED' THEN 1 ELSE 0 END) as missed,
                    SUM(CASE WHEN status = 'SCHEDULED' AND scheduled_date_time < NOW() THEN 1 ELSE 0 END) as overdue
                 FROM medication_schedules
                 WHERE patient_id = ?
                 AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
                [patientId, days]
            );
            
            const stats = rows[0];
            const adherenceRate = stats.total > 0 
                ? Math.round((stats.taken / stats.total) * 100) 
                : 0;
                
            return {
                total: stats.total,
                taken: stats.taken,
                missed: stats.missed,
                overdue: stats.overdue,
                adherenceRate
            };
        } catch (error) {
            console.error('Error getting adherence stats:', error);
            throw error;
        }
    }
}

module.exports = SchedulerService;