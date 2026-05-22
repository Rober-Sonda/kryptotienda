import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useRawMaterials } from '../../hooks/useRawMaterials';
import { useSales, type SaleItemRawMaterial } from '../../hooks/useSales';
import { ShoppingBag, PlusCircle, MinusCircle, CheckCircle, TrendingUp } from 'lucide-react';

const AdminSalesView: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { rawMaterials, loading: rmLoading } = useRawMaterials();
  const { sales, loading: salesLoading, registerSale } = useSales();
  
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [itemsUsed, setItemsUsed] = useState<{ rawMaterialId: string; quantity: number }[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate when product changes
  useEffect(() => {
    if (selectedProduct) {
      const prod = products.find(p => p.id === selectedProduct);
      if (prod) {
        setSalePrice(parseFloat(prod.offerPrice?.replace('$', '') || prod.price.replace('$', '') || '0'));
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0].name);
        } else {
          setSelectedSize('');
        }
        
        if (prod.bom && prod.bom.length > 0) {
          setItemsUsed(prod.bom.map(b => ({ rawMaterialId: b.rawMaterialId, quantity: b.quantity })));
        } else {
          setItemsUsed([]);
        }
      }
    }
  }, [selectedProduct, products]);

  const loading = productsLoading || rmLoading || salesLoading;

  if (loading) return <div>Cargando módulo de ventas...</div>;

  const currentProduct = products.find(p => p.id === selectedProduct);
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()));

  const handleAddRawMaterial = () => {
    if (rawMaterials.length > 0) {
      setItemsUsed([...itemsUsed, { rawMaterialId: rawMaterials[0].id!, quantity: 1 }]);
    }
  };

  const handleUpdateRawMaterial = (index: number, field: string, value: string | number) => {
    const newItems = [...itemsUsed];
    newItems[index] = { ...newItems[index], [field]: value };
    setItemsUsed(newItems);
  };

  const handleRemoveRawMaterial = (index: number) => {
    const newItems = [...itemsUsed];
    newItems.splice(index, 1);
    setItemsUsed(newItems);
  };

  const calculateTotalCost = () => {
    return itemsUsed.reduce((total, item) => {
      const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
      return total + (rm ? rm.cost * item.quantity : 0);
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const profit = salePrice - totalCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !currentProduct) {
      alert("Selecciona un producto");
      return;
    }

    // Prepare items with current cost
    const finalizedItems: SaleItemRawMaterial[] = itemsUsed.map(item => {
      const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
      return {
        rawMaterialId: item.rawMaterialId,
        name: rm?.name || 'Desconocido',
        quantity: item.quantity,
        costAtTime: rm?.cost || 0
      };
    });

    setIsSubmitting(true);
    try {
      await registerSale(
        currentProduct.id!,
        currentProduct.title,
        selectedSize,
        quantity,
        salePrice,
        finalizedItems
      );
      alert("¡Venta registrada y stock descontado exitosamente!");
      // Reset form
      setSelectedProduct('');
      setSelectedSize('');
      setQuantity(1);
      setSalePrice(0);
      setItemsUsed([]);
    } catch (error) {
      alert("Hubo un error al registrar la venta.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Registro de Ventas y Entregas</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Formulario de Registro */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} /> Nueva Entrega
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Buscar Producto *</label>
              <input 
                type="text" 
                placeholder="Escribe para buscar..." 
                value={productSearch} 
                onChange={(e) => setProductSearch(e.target.value)} 
                style={{ marginBottom: '10px' }}
              />
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)} 
                required 
                size={5} 
                style={{ overflowY: 'auto' }}
              >
                {filteredProducts.length === 0 && <option disabled>No se encontraron productos</option>}
                {filteredProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {currentProduct && currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <div className="admin-form-group">
                <label>Variante / Talle Entregado *</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} required>
                  {currentProduct.sizes.map(s => (
                    <option key={s.name} value={s.name}>{s.name} (Stock disp: {s.stock})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Cantidad *</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} required min="1" />
              </div>
              <div className="admin-form-group">
                <label>Precio de Venta (Ingreso) *</label>
                <input type="number" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)} required min="0" step="0.01" />
              </div>
            </div>

            <div className="admin-form-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ margin: 0 }}>Insumos Utilizados (Para Descontar)</label>
                <button type="button" onClick={handleAddRawMaterial} className="neon-btn small-btn" style={{ padding: "4px 8px" }}>
                  <PlusCircle size={16} /> Añadir Insumo
                </button>
              </div>
              
              {itemsUsed.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <select value={item.rawMaterialId} onChange={(e) => handleUpdateRawMaterial(index, 'rawMaterialId', e.target.value)} required>
                    {rawMaterials.map(rm => (
                      <option key={rm.id} value={rm.id}>{rm.name} (Costo: ${rm.cost} - Stock: {rm.stock})</option>
                    ))}
                  </select>
                  <input type="number" value={item.quantity} onChange={(e) => handleUpdateRawMaterial(index, 'quantity', parseFloat(e.target.value) || 0)} required min="0.01" step="0.01" placeholder="Cant." />
                  <button type="button" onClick={() => handleRemoveRawMaterial(index)} className="icon-btn danger">
                    <MinusCircle size={18} />
                  </button>
                </div>
              ))}
              {itemsUsed.length === 0 && <p style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>No se descontarán insumos.</p>}
            </div>

            <div style={{ backgroundColor: 'var(--bg-dark)', padding: '15px', borderRadius: '4px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Costo Total Insumos:</span>
                <span style={{ color: '#ff4444' }}>-${totalCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span>Ganancia Estimada:</span>
                <span style={{ color: profit > 0 ? 'var(--krypton-green)' : '#ff4444' }}>${profit.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="neon-btn small-btn" style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} disabled={isSubmitting}>
              <CheckCircle size={18} /> {isSubmitting ? 'Registrando...' : 'Registrar y Descontar Stock'}
            </button>
          </form>
        </div>

        {/* Historial de Ventas */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} /> Últimas Entregas
          </h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {sales.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay ventas registradas aún.</p>
            ) : (
              sales.map(sale => (
                <div key={sale.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{sale.quantitySold}x {sale.productTitle} {sale.sizeName ? `(${sale.sizeName})` : ''}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
                      {new Date(sale.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {sale.itemsUsed && sale.itemsUsed.length > 0 && (
                    <div style={{ fontSize: '0.85em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Insumos: {sale.itemsUsed.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em' }}>
                    <span>Ingreso: <span style={{ color: 'var(--krypton-green)' }}>${sale.priceSold.toFixed(2)}</span></span>
                    <span>Costo: <span style={{ color: '#ff4444' }}>${sale.totalCost.toFixed(2)}</span></span>
                    <span>Ganancia: <strong>${sale.profit.toFixed(2)}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSalesView;
