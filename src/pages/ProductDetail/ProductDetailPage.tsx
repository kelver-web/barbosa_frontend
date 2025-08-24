// Exemplo de código no componente pai (ex: ProductDetailPage.tsx)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api'; // Onde sua API está configurada
import ProductDetail from './ProductDetail';

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produtos/${id}/`); 
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  // A prop 'product' agora terá os dados completos da API, incluindo a imagem
  return <ProductDetail product={product} />;
};

export default ProductDetailPage;