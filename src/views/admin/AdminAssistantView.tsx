import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useFinances } from '../../hooks/useFinances';
import { useSales } from '../../hooks/useSales';
import { useRawMaterials } from '../../hooks/useRawMaterials';
import { useClaims } from '../../hooks/useClaims';
import { useCategories } from '../../hooks/useCategories';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';

// Es inseguro poner la API Key directamente en el código fuente.
// Crea un archivo .env en la raíz del proyecto con la variable VITE_GEMINI_API_KEY=tu_api_key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCb_LnP9JvmFU00MP2njy7WJMlUk7tl0T0";

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
  const { products, updateProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { addTransaction } = useFinances();
  const { sales } = useSales();
  const { rawMaterials, addRawMaterial, updateRawMaterial } = useRawMaterials();
  const { claims, updateClaimStatus } = useClaims();
  const { categories, updateCategory } = useCategories();

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
Estás integrado directamente en el panel de administración ERP. Tienes poderes absolutos sobre la base de datos si el dueño te lo solicita.
Fecha actual: ${today}. Ten en cuenta las fechas patrias argentinas o festividades cercanas para dar ideas de marketing o prever demandas.

DATOS EN TIEMPO REAL DEL NEGOCIO (Puedes modificar estos si el usuario te lo pide):
- Categorías: ${JSON.stringify(categories.map(c => ({ id: c.id, nombre: c.name, subcategorias: c.subcategories })))}
- Productos: ${JSON.stringify(products.map(p => ({ id: p.id, title: p.title, price: p.price, stock: p.sizes?.reduce((acc, s) => acc + s.stock, 0) || 0, category: p.category })))}
- Insumos/Materia Prima: ${JSON.stringify(rawMaterials.map(rm => ({ id: rm.id, nombre: rm.name, stock: rm.stock, minStock: rm.minStock, costo: rm.cost })))}
- Últimas Ventas: ${JSON.stringify(sales.slice(0, 5).map(s => ({ producto: s.productTitle, ganancia: s.profit })))}
- Pedidos Pendientes: ${JSON.stringify(orders.filter(o => o.status === 'pending' || o.status === 'processing').map(o => ({ id: o.id, numero: o.orderNumber, cliente: o.customerName, estado: o.status, monto: o.total })))}
- Reclamos Abiertos/En Revisión: ${JSON.stringify(claims.filter(c => c.status === 'open' || c.status === 'in_progress').map(c => ({ id: c.id, pedido: c.orderNumber, cliente: c.customerName, motivo: c.reason, estado: c.status })))}

REGLAS Y PROTOCOLOS:
- **RECLAMOS**: Eres un gerente de atención al cliente. Debes ser EMPÁTICO pero FIRME. Usa "updateClaimStatus" para avanzar los reclamos a "in_progress", "resolved", o "rejected".
- **PRODUCTOS**: Puedes modificar el precio, u oferta de un producto usando "updateProductData".
- **MATERIA PRIMA / INSUMOS**: Usa "updateRawMaterial" para cambiar stock, stock mínimo o costo, y "addRawMaterial" para crear nuevos.
- **CATEGORÍAS**: Usa "updateCategoryData" para renombrar o añadir subcategorías.
- **PEDIDOS**: Usa "updateOrderStatus" para cambiar estados de pedidos.
- Tus respuestas deben ser profesionales, directas y estratégicas.
- Responde siempre cualquier duda con la información provista en los datos en tiempo real.`;
  };

  const callGeminiAPI = async (history: ChatMessage[]) => {
    setIsLoading(true);
    
    // Add an empty model message to the state so we can stream into it
    setMessages([...history, { role: 'model', parts: [{ text: 'Analizando...' }] }]);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${API_KEY}`, {
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
              },
              {
                name: "updateClaimStatus",
                description: "Actualiza el estado de un reclamo de cliente y agrega notas de resolución.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    claimId: { type: "STRING", description: "ID del reclamo de Firebase" },
                    newStatus: { type: "STRING", description: "Nuevo estado: open, in_progress, resolved, rejected" },
                    resolutionNotes: { type: "STRING", description: "Notas ejecutivas y protocolares sobre la resolución o el rechazo." }
                  },
                  required: ["claimId", "newStatus", "resolutionNotes"]
                }
              },
              {
                name: "updateProductData",
                description: "Actualiza los datos de un producto (como precio u oferta).",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    productId: { type: "STRING", description: "ID del producto de Firebase" },
                    price: { type: "STRING", description: "Nuevo precio en formato string, ej: '15000'" },
                    offerPrice: { type: "STRING", description: "Nuevo precio de oferta en formato string, ej: '12000'" }
                  },
                  required: ["productId"]
                }
              },
              {
                name: "addRawMaterial",
                description: "Agrega un nuevo insumo a la base de datos de materias primas.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING", description: "Nombre de la materia prima" },
                    category: { type: "STRING", description: "Categoría: bolsa, tinta, cinta, papel, otros" },
                    cost: { type: "NUMBER", description: "Costo de adquisición" },
                    stock: { type: "NUMBER", description: "Stock inicial" },
                    minStock: { type: "NUMBER", description: "Nivel de stock mínimo para alertas" }
                  },
                  required: ["name", "category", "cost", "stock", "minStock"]
                }
              },
              {
                name: "updateRawMaterial",
                description: "Actualiza el stock, costo o stock mínimo de un insumo existente.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    materialId: { type: "STRING", description: "ID de la materia prima" },
                    stock: { type: "NUMBER", description: "Nuevo nivel de stock actual" },
                    minStock: { type: "NUMBER", description: "Nuevo nivel de stock mínimo" },
                    cost: { type: "NUMBER", description: "Nuevo costo" }
                  },
                  required: ["materialId"]
                }
              },
              {
                name: "updateCategoryData",
                description: "Actualiza una categoría (nombre o subcategorías).",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    categoryId: { type: "STRING", description: "ID de la categoría" },
                    name: { type: "STRING", description: "Nuevo nombre de la categoría" },
                    subcategories: { 
                      type: "ARRAY", 
                      items: { type: "STRING" },
                      description: "Array de strings con las nuevas subcategorías" 
                    }
                  },
                  required: ["categoryId"]
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Error en la respuesta de la API');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentText = '';
      let funcCallData: any = null;

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split(/\r?\n\r?\n/);
          buffer = parts.pop() || ''; 

          for (const part of parts) {
            const trimmedPart = part.trim();
            if (!trimmedPart.startsWith('data: ')) continue;
            
            const dataStr = trimmedPart.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              const modelPart = data.candidates?.[0]?.content?.parts?.[0];
              
              if (modelPart?.functionCall) {
                funcCallData = modelPart.functionCall;
              } else if (modelPart?.text) {
                currentText += modelPart.text;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = { ...newMessages[newMessages.length - 1] };
                  if (lastMsg.role === 'model') {
                    lastMsg.parts = [{ text: currentText }];
                    newMessages[newMessages.length - 1] = lastMsg;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Parse error chunk:", dataStr, e);
            }
          }
        }
      }

      if (funcCallData) {
        setPendingAction({
          name: funcCallData.name,
          args: funcCallData.args
        });
        setMessages(prev => {
           const newMessages = [...prev];
           const lastMsg = { ...newMessages[newMessages.length - 1] };
           lastMsg.parts = [{ functionCall: funcCallData }];
           newMessages[newMessages.length - 1] = lastMsg;
           return newMessages;
        });
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = { ...newMessages[newMessages.length - 1] };
        if (lastMsg.role === 'model' && (lastMsg.parts[0].text === 'Analizando...' || !lastMsg.parts[0].text)) {
           lastMsg.parts = [{ text: "Ocurrió un error de conexión con los servidores." }];
           newMessages[newMessages.length - 1] = lastMsg;
        } else if (lastMsg.role === 'user') {
           newMessages.push({ role: 'model', parts: [{ text: "Ocurrió un error al consultar a mis servidores." }] });
        }
        return newMessages;
      });
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
        } else if (pendingAction.name === 'updateClaimStatus') {
          await updateClaimStatus(pendingAction.args.claimId, pendingAction.args.newStatus, pendingAction.args.resolutionNotes);
          actionResult = `Reclamo actualizado a ${pendingAction.args.newStatus}. Notas guardadas: ${pendingAction.args.resolutionNotes}`;
        } else if (pendingAction.name === 'updateProductData') {
          const updateData: any = {};
          if (pendingAction.args.price) updateData.price = pendingAction.args.price;
          if (pendingAction.args.offerPrice) updateData.offerPrice = pendingAction.args.offerPrice;
          await updateProduct(pendingAction.args.productId, updateData);
          actionResult = `Producto actualizado correctamente en la base de datos.`;
        } else if (pendingAction.name === 'addRawMaterial') {
          await addRawMaterial({
            name: pendingAction.args.name,
            category: pendingAction.args.category,
            cost: pendingAction.args.cost,
            stock: pendingAction.args.stock,
            minStock: pendingAction.args.minStock
          });
          actionResult = `Materia prima ${pendingAction.args.name} agregada a la base de datos correctamente.`;
        } else if (pendingAction.name === 'updateRawMaterial') {
          const updateData: any = {};
          if (pendingAction.args.stock !== undefined) updateData.stock = pendingAction.args.stock;
          if (pendingAction.args.minStock !== undefined) updateData.minStock = pendingAction.args.minStock;
          if (pendingAction.args.cost !== undefined) updateData.cost = pendingAction.args.cost;
          await updateRawMaterial(pendingAction.args.materialId, updateData);
          actionResult = `Insumo actualizado exitosamente.`;
        } else if (pendingAction.name === 'updateCategoryData') {
          const updateData: any = {};
          if (pendingAction.args.name) updateData.name = pendingAction.args.name;
          if (pendingAction.args.subcategories) updateData.subcategories = pendingAction.args.subcategories;
          await updateCategory(pendingAction.args.categoryId, updateData);
          actionResult = `Categoría actualizada.`;
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
        <img src="/crystal-icon.png" alt="Krypton AI" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <h2>Asistente Inteligente Krypton</h2>
      </div>

      <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50px' }}>
              <img src="/crystal-icon.png" alt="Krypton AI" style={{ width: '48px', height: '48px', opacity: 0.5, marginBottom: '10px', objectFit: 'contain' }} />
              <p>Hola, soy tu asistente de negocio. Pregúntame sobre tus ventas, stock, pedidos o pídeme consejos estratégicos.</p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.parts[0].functionResponse) return null; // Hide function responses

            const isUser = msg.role === 'user';
            const isFunctionCall = msg.parts[0].functionCall;

            return (
              <div key={i} style={{ display: 'flex', gap: '10px', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {!isUser && <img src="/crystal-icon.png" alt="Krypton AI" style={{ width: '24px', height: '24px', marginTop: '10px', objectFit: 'contain' }} />}
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
