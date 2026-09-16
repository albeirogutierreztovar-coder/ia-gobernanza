import React, { useState } from 'react';
import { SlideOver } from '../ui/SlideOver';
import { Bot, ChevronRight, CheckCircle2, Circle, ArrowRight, Lightbulb, PlayCircle, ShieldCheck, Database, ListChecks } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: 'implementation' | 'audit' | 'general';
}

export function AIAssistantDrawer({ isOpen, onClose, context }: AIAssistantDrawerProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const implementationSteps = [
    {
      id: 1,
      title: 'Contexto y Liderazgo (Cláusulas 4 y 5)',
      desc: 'Define el alcance, políticas y roles de gobernanza.',
      details: 'Para ISO 27001 e ISO 42001, debes empezar por entender el contexto de la organización, identificar partes interesadas y establecer el liderazgo. Ve a "Gobernanza" -> "Mapa de Gobernanza" y registra tus roles clave y políticas.',
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Evaluación de Riesgos e Impacto (Cláusula 6)',
      desc: 'Identifica riesgos de seguridad e impacto de la IA.',
      details: 'Usa el "Risk Hub" para registrar riesgos de seguridad de la información (ISO 27001). Si desarrollas o usas IA, debes realizar una Evaluación de Impacto de IA (ISO 42001) y registrar los riesgos asociados a sesgos, privacidad o seguridad del modelo.',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Controles y Operación (Cláusulas 7 y 8)',
      desc: 'Implementa controles del Anexo A.',
      details: 'Ve a la pestaña "Controles" (Anexo A). Aquí debes registrar la Declaración de Aplicabilidad (SoA). Para ISO 42001, incluye controles específicos sobre transparencia, explicabilidad y supervisión humana.',
      icon: <ListChecks className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Auditoría y Mejora (Cláusulas 9 y 10)',
      desc: 'Mide, audita y mejora continuamente.',
      details: 'Programa auditorías internas en la sección "Auditorías". Levanta Hallazgos y gestiona No Conformidades a través de CAPA (Acciones Correctivas).',
      icon: <PlayCircle className="w-5 h-5" />
    }
  ];

  const auditSteps = [
    {
      id: 1,
      title: 'Planificación de la Auditoría',
      desc: 'Define alcance, criterios y cronograma.',
      details: 'En el módulo de Auditorías, crea un "Plan de Auditoría". Define si será integrada (27001 + 42001) o específica. Asigna al auditor líder.',
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Ejecución y Listas de Verificación',
      desc: 'Evalúa la evidencia contra las cláusulas.',
      details: 'Usa las listas de verificación (Checklists) pre-cargadas para ISO 27001 y 42001. Solicita evidencia documentada (políticas, registros de log, pruebas de impacto de IA).',
      icon: <ListChecks className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Levantamiento de Hallazgos',
      desc: 'Registra No Conformidades u Oportunidades.',
      details: 'Si un requisito no se cumple, regístralo como "No Conformidad Mayor/Menor". Si puede mejorar, márcalo como "Oportunidad de Mejora (OM)".',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Informe y Plan de Acción (CAPA)',
      desc: 'Genera el reporte final y seguimiento.',
      details: 'El auditado debe proponer Acciones Correctivas (CAPA) para cada No Conformidad. El auditor debe verificar que las acciones cierren la brecha de raíz.',
      icon: <PlayCircle className="w-5 h-5" />
    }
  ];

  const steps = context === 'audit' ? auditSteps : implementationSteps;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={context === 'audit' ? "Asistente: Guía de Auditoría" : "Asistente: Guía de Implementación"}
      description="Te guiaré paso a paso por el flujo normativo de las normas ISO 27001 e ISO 42001."
    >
      <div className="mt-2 space-y-6">
        
        {/* Intro Banner */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-900">Hola, soy tu Agente de Gobernanza.</h3>
            <p className="text-sm text-teal-700 mt-1">
              {context === 'audit' 
                ? 'El proceso de auditoría garantiza que tu Sistema de Gestión funcione. Te mostraré la ruta recomendada para ejecutar una auditoría exitosa.' 
                : 'Implementar un Sistema Integrado (SGSI + SGSIA) requiere orden. Aquí tienes el paso a paso recomendado según el Anexo SL de ISO.'}
            </p>
          </div>
        </div>

        {/* Timeline / Steps */}
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-6">
              <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${activeStep >= step.id ? 'bg-teal-500 text-white ring-4 ring-white' : 'bg-slate-200 text-slate-500 ring-4 ring-white'}`}>
                {activeStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold">{step.id}</span>}
              </span>
              
              <div 
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${activeStep === step.id ? 'border-teal-300 shadow-md ring-1 ring-teal-300' : 'border-slate-200 hover:border-teal-200'}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`p-1.5 rounded-lg ${activeStep === step.id ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                      {step.icon}
                    </span>
                    <h4 className={`font-bold ${activeStep === step.id ? 'text-teal-900' : 'text-slate-700'}`}>{step.title}</h4>
                  </div>
                  {activeStep !== step.id && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-2">{step.desc}</p>
                
                {activeStep === step.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 leading-relaxed">{step.details}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      {activeStep < steps.length ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveStep(step.id + 1); }}
                          className="flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Siguiente Paso <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onClose(); }}
                          className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          Entendido, ¡Manos a la obra!
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </SlideOver>
  );
}
