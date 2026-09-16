import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const demoData = {
  organization: {
    id: "org-1",
    name: "NOVA LOGÍSTICA S.A.S.",
    sector: "Logística",
    country: "Colombia",
    city: "Bogotá",
    employees: 450,
    leader: "Ana Martínez",
    email: "amartinez@novalogistica.com",
    standards: ["ISO/IEC 27001", "ISO/IEC 42001"],
    status: "En proceso"
  },
  metrics: {
    implementation: 72,
    evidence: 61,
    efficacy: 54,
    auditReadiness: 47
  },
  priorities: [
    "1 evidencia vence en 7 días.",
    "2 riesgos altos no tienen tratamiento aprobado.",
    "1 sistema de IA requiere reevaluación.",
    "3 acciones correctivas están vencidas."
  ],
  processes: [
    { id: "p1", name: "Gerencia", leader: "Carlos Ruiz" },
    { id: "p2", name: "TI", leader: "Luis Gómez" },
    { id: "p3", name: "Comercial", leader: "María Pérez" },
    { id: "p4", name: "Operaciones", leader: "Jorge Silva" },
    { id: "p5", name: "Talento Humano", leader: "Ana Martínez" },
    { id: "p6", name: "Servicio al Cliente", leader: "Laura Torres" }
  ],
  aiSystems: [
    { id: "ai1", name: "Asistente RRHH", process: "Talento Humano", type: "Chatbot", risk: "Medio", status: "Aprobado" },
    { id: "ai2", name: "Chatbot de clientes", process: "Servicio al Cliente", type: "Agente AI", risk: "Alto", status: "Pendiente" },
    { id: "ai3", name: "Asistente de desarrollo", process: "TI", type: "Copilot", risk: "Bajo", status: "Aprobado" },
    { id: "ai4", name: "Modelo predictivo de riesgo", process: "Operaciones", type: "Modelo Predictivo", risk: "Crítico", status: "En evaluación" }
  ],
  risks: [
    { id: "r1", name: "Fuga de datos personales por chatbot", type: "Seguridad / IA", level: "Alto", status: "Abierto" },
    { id: "r2", name: "Sesgo en selección de personal", type: "IA", level: "Medio", status: "Tratado" },
    { id: "r3", name: "Interrupción de servicios cloud", type: "Operacional", level: "Crítico", status: "Abierto" }
  ],
  alerts: [
    { id: "a1", type: "CRÍTICO", message: "Riesgo residual 'Interrupción de servicios cloud' fuera de tolerancia", date: "Hoy" },
    { id: "a2", type: "ALTO", message: "Sistema IA 'Chatbot de clientes' sin impacto evaluado", date: "Ayer" },
    { id: "a3", type: "MEDIO", message: "Evidencia 'Política de control de acceso' vence en 7 días", date: "Hace 2 días" }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    res.json(demoData);
  });
  
  app.get("/api/processes", (req, res) => {
    res.json(demoData.processes);
  });

  app.get("/api/ai-systems", (req, res) => {
    res.json(demoData.aiSystems);
  });
  
  app.get("/api/risks", (req, res) => {
    res.json(demoData.risks);
  });
  
  app.get("/api/alerts", (req, res) => {
    res.json(demoData.alerts);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
