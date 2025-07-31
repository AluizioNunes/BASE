import LazyImage from './LazyImage';

export default function ImageExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Exemplo de Lazy Loading de Imagens</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Exemplo com imagem local */}
        <LazyImage
          src="/vite.svg"
          alt="Vite Logo"
          width={200}
          height={200}
          webpSrc="/vite.svg?format=webp&w=200&h=200"
        />
        
        {/* Exemplo com placeholder personalizado */}
        <LazyImage
          src="https://picsum.photos/200/200?random=1"
          alt="Random Image 1"
          width={200}
          height={200}
          placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+"
        />
        
        {/* Exemplo com WebP */}
        <LazyImage
          src="https://picsum.photos/200/200?random=2"
          alt="Random Image 2"
          width={200}
          height={200}
          webpSrc="https://picsum.photos/200/200?random=2&format=webp"
        />
        
        {/* Exemplo com diferentes tamanhos */}
        <LazyImage
          src="https://picsum.photos/300/200?random=3"
          alt="Random Image 3"
          width={300}
          height={200}
        />
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h4>Como usar o componente LazyImage:</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`import LazyImage from './components/LazyImage';

// Uso básico
<LazyImage
  src="/path/to/image.jpg"
  alt="Descrição da imagem"
  width={200}
  height={200}
/>

// Com suporte a WebP
<LazyImage
  src="/path/to/image.jpg"
  alt="Descrição da imagem"
  width={200}
  height={200}
  webpSrc="/path/to/image.webp"
/>

// Com placeholder personalizado
<LazyImage
  src="/path/to/image.jpg"
  alt="Descrição da imagem"
  width={200}
  height={200}
  placeholder="data:image/svg+xml;base64,..."
/>`}
        </pre>
      </div>
    </div>
  );
} 