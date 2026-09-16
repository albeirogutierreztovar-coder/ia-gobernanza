import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  MapPin, 
  Users, 
  Shield, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Search, 
  X, 
  ExternalLink,
  Tag,
  Sparkles,
  Layers,
  CalendarCheck,
  CalendarDays,
  ListOrdered
} from 'lucide-react';
import { CalendarEvent, CalendarEventCategory } from '../types';

type ViewMode = 'month' | 'week' | 'agenda';

const CATEGORY_STYLES: Record<CalendarEventCategory, { bg: string; text: string; border: string; dot: string }> = {
  'Auditoría': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'Comité IA & Ética': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Revisión por la Dirección': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Vencimiento CAPA': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Evaluación AIA': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  'Simulacro Seguridad': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Capacitación': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'Renovación Evidencia': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
};

export function CalendarPage() {
  const { data, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useStore();
  
  // Date state (defaulting to September 2026 based on project context)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 1)); // Sept 2026
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected event for detail modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Modal for new event
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState('2026-09-20');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<CalendarEventCategory>('Auditoría');
  const [newEventStandard, setNewEventStandard] = useState<'ISO/IEC 27001' | 'ISO/IEC 42001' | 'Integrado'>('Integrado');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventDuration, setNewEventDuration] = useState(60);
  const [newEventResponsible, setNewEventResponsible] = useState('Oficial de Seguridad & IA');
  const [newEventLocation, setNewEventLocation] = useState('Sala de Crisis / Virtual');
  const [newEventClause, setNewEventClause] = useState('');

  // Extract all calendar events (stored + derived from audit sessions if any)
  const allEvents: CalendarEvent[] = useMemo(() => {
    const list = [...(data?.calendarEvents || [])];

    // If there are auditSessions that aren't yet in calendarEvents, mirror them safely
    if (data?.auditSessions) {
      data.auditSessions.forEach(session => {
        if (!list.some(e => e.id === `as-evt-${session.id}` || e.title === session.title)) {
          list.push({
            id: `as-evt-${session.id}`,
            organizationId: session.organizationId,
            title: `Auditoría: ${session.title}`,
            description: session.scope || 'Auditoría programada del sistema de gestión.',
            date: session.plannedDate,
            time: '09:00',
            durationMinutes: 480,
            category: 'Auditoría',
            standard: session.standard.includes('42001') && session.standard.includes('27001') ? 'Integrado' : 
                      session.standard.includes('42001') ? 'ISO/IEC 42001' : 'ISO/IEC 27001',
            status: session.status === 'Completada' ? 'Completado' : 'Programado',
            responsible: session.leadAuditor,
            location: 'Oficinas Principales & Entorno Cloud',
            clause: 'Cláusula 9.2'
          });
        }
      });
    }

    return list;
  }, [data?.calendarEvents, data?.auditSessions]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (selectedStandard !== 'all' && event.standard !== selectedStandard) return false;
      if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchDesc = event.description?.toLowerCase().includes(q);
        const matchResp = event.responsible.toLowerCase().includes(q);
        const matchClause = event.clause?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchResp || matchClause;
      }
      return true;
    });
  }, [allEvents, selectedStandard, selectedCategory, searchQuery]);

  // Year and month helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 16)); // Context date: Sept 16, 2026
  };

  // Month grid calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
    // Adjust for Monday as first day: Mon=0, Tue=1 ... Sun=6
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const currDate = new Date(year, month, dayNum);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-16',
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    // Next month padding to fill complete weeks (up to 35 or 42 cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(year, month + 1, dayNum);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateStr)
      });
    }

    return days;
  }, [year, month, filteredEvents]);

  // Statistics for current month
  const monthMetrics = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const thisMonthEvents = filteredEvents.filter(e => e.date.startsWith(monthPrefix));

    return {
      total: thisMonthEvents.length,
      audits: thisMonthEvents.filter(e => e.category === 'Auditoría').length,
      committees: thisMonthEvents.filter(e => e.category === 'Comité IA & Ética').length,
      capas: thisMonthEvents.filter(e => e.category === 'Vencimiento CAPA' || e.category === 'Simulacro Seguridad').length,
      completed: thisMonthEvents.filter(e => e.status === 'Completado').length
    };
  }, [filteredEvents, year, month]);

  // Export to .ics format
  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AIGobernanza 360//Calendario GRC ISO 27001 & 42001//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    filteredEvents.forEach(evt => {
      const cleanDate = evt.date.replace(/-/g, '');
      const startTime = (evt.time || '09:00').replace(':', '') + '00';
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${evt.id}@aigobernanza360.com`,
        `SUMMARY:[${evt.standard}] ${evt.title}`,
        `DESCRIPTION:${evt.description || ''} | Resp: ${evt.responsible} | Cláusula: ${evt.clause || 'N/A'}`,
        `DTSTART:${cleanDate}T${startTime}`,
        `LOCATION:${evt.location || 'Oficinas Centrales'}`,
        `STATUS:${evt.status === 'Completado' ? 'CONFIRMED' : 'TENTATIVE'}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Calendario_Gobernanza_${year}_${month + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    await addCalendarEvent({
      organizationId: data?.organization.id || 'org-nova',
      title: newEventTitle,
      description: newEventDescription,
      date: newEventDate,
      time: newEventTime,
      durationMinutes: Number(newEventDuration) || 60,
      category: newEventCategory,
      standard: newEventStandard,
      status: 'Programado',
      responsible: newEventResponsible,
      location: newEventLocation,
      clause: newEventClause || undefined
    });

    setNewEventTitle('');
    setNewEventDescription('');
    setShowCreateModal(false);
  };

  const handleToggleEventStatus = async (event: CalendarEvent) => {
    const nextStatus = event.status === 'Completado' ? 'Programado' : 'Completado';
    await updateCalendarEvent(event.id, { status: nextStatus });
    if (selectedEvent && selectedEvent.id === event.id) {
      setSelectedEvent({ ...selectedEvent, status: nextStatus });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteCalendarEvent(id);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6" id="governance-calendar-page">
      {/* Header & Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendario de Gobernanza & Auditorías</h1>
              <p className="text-sm text-slate-500">
                Cronograma unificado de hitos, comités de IA (ISO 42001), revisiones por la dirección y auditorías del SGSI (ISO 27001).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* View switcher */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Mes
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Agenda / Lista
            </button>
          </div>

          <button
            onClick={handleExportICS}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
            title="Exportar archivo .ics compatible con Google Calendar y Outlook"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            Exportar iCal
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Programar Hito
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hitos del Mes</span>
            <CalendarCheck className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{monthMetrics.total}</p>
          <span className="text-xs text-slate-500 mt-1 block">{monthNames[month]} {year}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Auditorías</span>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{monthMetrics.audits}</p>
          <span className="text-xs text-slate-500 mt-1 block">Internas & Certificación</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Comités IA & AIA</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">{monthMetrics.committees}</p>
          <span className="text-xs text-slate-500 mt-1 block">ISO 42001 Cláusula 6.1.4</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Completados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{monthMetrics.completed}</p>
          <span className="text-xs text-slate-500 mt-1 block">Ejecutados a conformidad</span>
        </div>
      </div>

      {/* Filter and Navigation Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
              title="Mes Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              Hoy (Septiembre 2026)
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
              title="Mes Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-base font-bold text-slate-900 ml-2">
            {monthNames[month]} <span className="text-slate-500 font-normal">{year}</span>
          </span>
        </div>

        {/* Filter Dropdowns & Search */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar evento o responsable..."
              className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg w-44 lg:w-56 focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-teal-500"
          >
            <option value="all">Norma: Todas</option>
            <option value="ISO/IEC 27001">ISO/IEC 27001</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001</option>
            <option value="Integrado">Integrado</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-teal-500"
          >
            <option value="all">Categoría: Todas</option>
            <option value="Auditoría">Auditoría</option>
            <option value="Comité IA & Ética">Comité IA & Ética</option>
            <option value="Revisión por la Dirección">Revisión por la Dirección</option>
            <option value="Vencimiento CAPA">Vencimiento CAPA</option>
            <option value="Simulacro Seguridad">Simulacro Seguridad</option>
            <option value="Capacitación">Capacitación</option>
          </select>
        </div>
      </div>

      {/* Main View Display: Month Grid or Agenda View */}
      {viewMode === 'month' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="month-grid-container">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className="py-2.5 text-xs font-bold text-slate-600 tracking-wider uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[580px]">
            {calendarDays.map((day, index) => {
              return (
                <div
                  key={`${day.dateStr}-${index}`}
                  onClick={() => {
                    setNewEventDate(day.dateStr);
                  }}
                  className={`p-2 transition-colors flex flex-col justify-between group min-h-[110px] ${
                    !day.isCurrentMonth
                      ? 'bg-slate-50/40 text-slate-400'
                      : day.isToday
                      ? 'bg-teal-50/20'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Date number and add icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                        day.isToday
                          ? 'bg-teal-600 text-white shadow-xs'
                          : day.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {day.dayNum}
                    </span>

                    <button
                      type="button"
                      title="Agregar evento en este día"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewEventDate(day.dateStr);
                        setShowCreateModal(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-teal-600 rounded transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day's Event chips */}
                  <div className="mt-1.5 space-y-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                    {day.events.map((evt) => {
                      const style = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES['Auditoría'];
                      const isCompleted = evt.status === 'Completado';

                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className={`px-1.5 py-1 rounded text-[11px] font-medium border cursor-pointer transition-all truncate flex items-center gap-1 ${
                            style.bg
                          } ${style.border} ${style.text} ${
                            isCompleted ? 'line-through opacity-60' : 'hover:shadow-xs hover:scale-[1.01]'
                          }`}
                          title={`${evt.time || ''} ${evt.title} (${evt.responsible})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                          <span className="truncate">{evt.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Timeline List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="agenda-list-view">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Cronograma Detallado de Gobernanza ({filteredEvents.length} eventos programados)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Ordenado cronológicamente</span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-800">No hay eventos para mostrar</h4>
              <p className="text-xs text-slate-500 mt-1">Intente ajustar los filtros de búsqueda o la norma seleccionada.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEvents
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((evt) => {
                  const style = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES['Auditoría'];
                  const isCompleted = evt.status === 'Completado';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group ${
                        isCompleted ? 'bg-slate-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* Left: Date badge & Category */}
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center shrink-0 min-w-[64px]">
                          <span className="block text-[10px] font-bold uppercase text-slate-500">
                            {new Date(evt.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })}
                          </span>
                          <span className="block text-xl font-extrabold text-slate-900 leading-tight">
                            {evt.date.split('-')[2]}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${style.bg} ${style.border} ${style.text}`}>
                              {evt.category}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {evt.standard}
                            </span>
                            {evt.clause && (
                              <span className="text-[11px] font-mono text-slate-500">
                                Ref: {evt.clause}
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Completado
                              </span>
                            )}
                          </div>

                          <h4 className={`text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                            {evt.title}
                          </h4>

                          {evt.description && (
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-2xl leading-relaxed">
                              {evt.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                            {evt.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {evt.time} ({evt.durationMinutes || 60} min)
                              </span>
                            )}
                            {evt.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {evt.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {evt.responsible}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEventStatus(evt);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isCompleted
                              ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isCompleted ? 'Reabrir' : 'Completar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_STYLES[selectedEvent.category]?.dot || 'bg-teal-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {selectedEvent.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {selectedEvent.standard}
                  </span>
                  {selectedEvent.clause && (
                    <span className="text-xs font-mono text-slate-500">
                      Ref: {selectedEvent.clause}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>

              {selectedEvent.description && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  {selectedEvent.description}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-medium">Fecha y Hora</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">
                    {selectedEvent.date} {selectedEvent.time ? `• ${selectedEvent.time}` : ''}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-medium">Líder Responsable</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block truncate">
                    {selectedEvent.responsible}
                  </span>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.link && (
                <div className="flex items-center gap-2 text-xs">
                  <ExternalLink className="w-4 h-4 text-teal-600 shrink-0" />
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 hover:text-teal-800 font-medium underline truncate"
                  >
                    {selectedEvent.link}
                  </a>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1.5">Participantes convocados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.attendees.map((attendee, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  Eliminar Hito
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleEventStatus(selectedEvent)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 ${
                      selectedEvent.status === 'Completado'
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedEvent.status === 'Completado' ? 'Marcar como Pendiente' : 'Marcar como Completado'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Scheduling New Event */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Programar Hito de Gobernanza</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Evento / Sesión *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Ej. Revisión Trimestral del Comité de IA (ISO 42001 Cl. 6.1.4)"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Auditoría">Auditoría</option>
                    <option value="Comité IA & Ética">Comité IA & Ética</option>
                    <option value="Revisión por la Dirección">Revisión por la Dirección</option>
                    <option value="Vencimiento CAPA">Vencimiento CAPA</option>
                    <option value="Evaluación AIA">Evaluación AIA</option>
                    <option value="Simulacro Seguridad">Simulacro Seguridad</option>
                    <option value="Capacitación">Capacitación</option>
                    <option value="Renovación Evidencia">Renovación Evidencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estándar Aplicable
                  </label>
                  <select
                    value={newEventStandard}
                    onChange={(e) => setNewEventStandard(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Integrado">Sistema Integrado</option>
                    <option value="ISO/IEC 27001">ISO/IEC 27001</option>
                    <option value="ISO/IEC 42001">ISO/IEC 42001</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newEventDuration}
                    onChange={(e) => setNewEventDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Responsable / Auditor Líder *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventResponsible}
                    onChange={(e) => setNewEventResponsible(e.target.value)}
                    placeholder="Ej. Dr. Elena Gómez"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cláusula / Control Relacionado
                  </label>
                  <input
                    type="text"
                    value={newEventClause}
                    onChange={(e) => setNewEventClause(e.target.value)}
                    placeholder="Ej. Cláusula 9.3 o Control A.8.1"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubicación física o enlace de videollamada
                </label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="Ej. Sala de Crisis / meet.google.com/xyz-abc"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objetivo & Alcance de la Sesión
                </label>
                <textarea
                  rows={2}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Detalles sobre entregables, evidencias a revisar o decisiones a tomar..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Programar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
