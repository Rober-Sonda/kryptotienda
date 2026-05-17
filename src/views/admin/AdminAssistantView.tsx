import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useFinances } from '../../hooks/useFinances';
import { useSales } from '../../hooks/useSales';
import { useRawMaterials } from '../../hooks/useRawMaterials';
import { Bot, Send, User, CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';

const API_KEY = "AIzaSyCb_LnP9JvmFU00MP2njy7WJMlUk7tl0T0";

interface MessagePart {
  text?: string;
  functionCall?: {
    name: string;
    args: any;
  };
  functionResponse?: {
    name: string;
    response: {
      name: string;
      content: any;
    };
  };
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: MessagePart[];
}

const AdminAssistantView: React.FC = () => {
  const { products } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { transactions, addTransaction } = useFinances();
  const { sales } = useSales();
  const { rawMaterials } = useRawMaterials();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{name: string, args: any} | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAction]);

  const buildSystemInstruction = () => {
    const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `Eres KRYPTON-AI, el Asistente de Negocio y Estratega Financiero de Krypton. 
Estás integrado directamente en el panel de administración ERP.
Fecha actual: ${today}. Ten en cuenta las fechas patrias argentinas o festividades cercanas para dar ideas de marketing o prever demandas.

DATOS EN TIEMPO REAL DEL NEGOCIO (Solo lectura, pero tienes herramientas para modificar si el usuario lo pide):
- Productos Activos: ${products.length}
- Inventario Materias Primas: ${JSON.stringify(rawMaterials.map(rm => ({ nombre: rm.name, stock: rm.stock, costo: rm.cost })))}
- Últimas 10 Ventas: ${JSON.stringify(sales.slice(0, 10).map(s => ({ producto: s.productTitle, ganancia: s.profit })))}
- Últimas Transacciones (Finanzas): ${JSON.stringify(transactions.slice(0, 10).map(t => ({ tipo: t.type, monto: t.amount, desc: t.description })))}
- Pedidos Pendientes/En Proceso: ${JSON.stringify(orders.filter(o => o.status === 'pending' || o.status === 'processing').map(o => ({ id: o.id, cliente: o.customerName, estado: o.status, monto: o.total })))}

REGLAS:
- Si el usuario pide cambiar el estado de un pedido o registrar un gasto/ingreso, usa la herramienta correspondiente (Function Calling).
- Tus respuestas deben ser profesionales, directas, estratégicas y amigables.
- Formatea el texto con markdown para que sea fácil de leer (usando **negritas**, listas, etc.).`;
  };

  const callGeminiAPI = async (history: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemInstruction() }] },
          contents: history,
          tools: [{
            function_declarations: [
              {
                name: "updateOrderStatus",
                description: "Actualiza el estado de un pedido.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    orderId: { type: "STRING", description: "ID del pedido de Firebase" },
                    newStatus: { type: "STRING", description: "Nuevo estado: pending, processing, shipped, delivered, cancelled" }
                  },
                  required: ["orderId", "newStatus"]
                }
              },
              {
                name: "addExpenseTransaction",
                description: "Agrega un gasto, egreso o inversión a las finanzas.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    amount: { type: "NUMBER", description: "Monto del registro" },
                    description: { type: "STRING", description: "Descripción del registro" },
                    category: { type: "STRING", description: "Categoría: insumos, servicios, marketing, otros" }
                  },
                  required: ["amount", "description", "category"]
                }
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const modelPart = data.candidates?.[0]?.content?.parts?.[0];

      if (modelPart?.functionCall) {
        setPendingAction({
          name: modelPart.functionCall.name,
          args: modelPart.functionCall.args
        });
        setMessages([...history, { role: 'model', parts: [modelPart] }]);
      } else if (modelPart?.text) {
        setMessages([...history, { role: 'model', parts: [modelPart] }]);
      }
    } catch (e) {
      console.error(e);
      setMessages([...history, { role: 'model', parts: [{ text: "Ocurrió un error al consultar a mis servidores." }] }]);
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const newMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newHistory = [...messages, newMessage];
    setMessages(newHistory);
    setInput('');
    await callGeminiAPI(newHistory);
  };

  const executePendingAction = async (approved: boolean) => {
    if (!pendingAction) return;
    
    let actionResult = '';
    
    if (approved) {
      try {
        if (pendingAction.name === 'updateOrderStatus') {
          await updateOrderStatus(pendingAction.args.orderId, pendingAction.args.newStatus);
          actionResult = `Pedido ${pendingAction.args.orderId} actualizado a ${pendingAction.args.newStatus}.`;
        } else if (pendingAction.name === 'addExpenseTransaction') {
          await addTransaction({
            type: 'expense',
            amount: pendingAction.args.amount,
            description: pendingAction.args.description,
            category: pendingAction.args.category
          });
          actionResult = `Gasto de $${pendingAction.args.amount} registrado exitosamente.`;
        }
      } catch (e) {
        actionResult = `Error al ejecutar: ${e}`;
      }
    } else {
      actionResult = "El usuario rechazó la acción.";
    }

    const responseMsg: ChatMessage = {
      role: 'user',
      parts: [{
        functionResponse: {
          name: pendingAction.name,
          response: { name: pendingAction.name, content: { result: actionResult } }
        }
      }]
    };

    setPendingAction(null);
    const newHistory = [...messages, responseMsg];
    setMessages(newHistory);
    await callGeminiAPI(newHistory);
  };

  // Simple Markdown to HTML parser for bold text
  const parseMarkdown = (text: string) => {
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Bot size={32} color="var(--krypton-green)" />
        <h2>Asistente Inteligente Krypton</h2>
      </div>

      <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50px' }}>
              <Bot size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
              <p>Hola, soy tu asistente de negocio. Pregúntame sobre tus ventas, stock, pedidos o pídeme consejos estratégicos.</p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.parts[0].functionResponse) return null; // Hide function responses

            const isUser = msg.role === 'user';
            const isFunctionCall = msg.parts[0].functionCall;

            return (
              <div key={i} style={{ display: 'flex', gap: '10px', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {!isUser && <Bot size={24} color="var(--krypton-green)" style={{ marginTop: '10px' }} />}
                <div style={{ 
                  background: isUser ? 'var(--krypton-green)' : 'var(--bg-dark)', 
                  color: isUser ? '#000' : 'var(--text-main)', 
                  padding: '12px 18px', 
                  borderRadius: '16px',
                  borderTopRightRadius: isUser ? '4px' : '16px',
                  borderTopLeftRadius: !isUser ? '4px' : '16px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {isFunctionCall ? (
                    <div style={{ color: '#f39c12', fontStyle: 'italic' }}>
                      ⚙️ Intentando ejecutar acción: {msg.parts[0].functionCall?.name}
                    </div>
                  ) : (
                    parseMarkdown(msg.parts[0].text || '')
                  )}
                </div>
              </div>
            );
          })}

          {pendingAction && (
            <div style={{ alignSelf: 'center', background: 'rgba(243, 156, 18, 0.1)', border: '1px solid #f39c12', padding: '15px', borderRadius: '8px', maxWidth: '80%' }}>
              <h4 style={{ color: '#f39c12', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ⚠️ Autorización Requerida
              </h4>
              <p style={{ marginBottom: '15px' }}>
                La IA solicita ejecutar <strong>{pendingAction.name}</strong> con los datos: <br/>
                <code>{JSON.stringify(pendingAction.args, null, 2)}</code>
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => executePendingAction(false)} className="neon-btn small-btn" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444' }}>
                  <XCircle size={16} /> Rechazar
                </button>
                <button onClick={() => executePendingAction(true)} className="neon-btn small-btn" style={{ background: '#2ecc71', color: '#000', border: 'none' }}>
                  <CheckCircle size={16} /> Aprobar Acción
                </button>
              </div>
            </div>
          )}

          {isLoading && !pendingAction && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <Bot size={24} color="var(--krypton-green)" />
              <div style={{ background: 'var(--bg-dark)', padding: '12px 18px', borderRadius: '16px', color: 'var(--krypton-green)' }}>
                Analizando...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'var(--bg-main)' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta o instrucción..."
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
            disabled={isLoading || !!pendingAction}
          />
          <button 
            onClick={handleSend}
            className="neon-btn"
            style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={isLoading || !!pendingAction || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAssistantView;
