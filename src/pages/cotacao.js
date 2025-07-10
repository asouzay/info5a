import { useState } from 'react';
import axios from 'axios';

export default function Cotacao() {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [cotações, setCotações] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarCotacoes = () => {
    if (!inicio || !fim) {
      alert('Preencha as duas datas!');
      return;
    }

    const start_date = inicio.replace(/-/g, '');
    const end_date = fim.replace(/-/g, '');

    setLoading(true);
    setErro(null);

    axios
      .get(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${start_date}&end_date=${end_date}`)
      .then((res) => setCotações(res.data))
      .catch(() => setErro('Erro ao buscar cotações.'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Buscar Cotação USD/BRL</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Data Início: <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </label>{' '}
        <label>
          Data Fim: <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
        </label>{' '}
        <button onClick={buscarCotacoes}>Buscar</button>
      </div>

      {loading && <p>Carregando...</p>}
      {erro && <p>{erro}</p>}

      {cotações.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Data</th>
              <th>Máximo</th>
              <th>Mínimo</th>
              <th>Fechamento</th>
            </tr>
          </thead>
          <tbody>
            {cotações.map((c) => (
              <tr key={c.timestamp}>
                <td>{new Date(c.timestamp * 1000).toLocaleDateString()}</td>
                <td>R$ {parseFloat(c.high).toFixed(2)}</td>
                <td>R$ {parseFloat(c.low).toFixed(2)}</td>
                <td>R$ {parseFloat(c.bid).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
