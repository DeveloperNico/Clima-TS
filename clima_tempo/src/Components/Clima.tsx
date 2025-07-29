import { use, useState } from "react"
import axios from "axios"

interface WeatherResponse {
    location: {
        name : string;
        country: string;
        localtime: string;
    };

    current : {
        temp_c : number;
        humidity: number;
        wind_kph: number;
        feelslike_c: number;
        last_updated: string;
        condition: {
            text: string;
            icon: string;
        }
    };
}

export function Clima() {
    const [cidade, setCidade] = useState('');
    const [temperatura, setTemperatura] = useState <number | null>(null);
    const [nomeCidade, setNomeCidade] = useState('');
    const [error, setError] = useState('');
    const [umidade, setUmidade] = useState <number | null>(null);
    const [descricao, setDescricao] = useState('');
    const [velocidadeVento, setVelocidadeVento] = useState <number | null>(null);
    const [sensacaoTermica, setSensacaoTermica] = useState <number | null>(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');
    const [icone, setIcone] = useState('');
    const [DataHoraAtual, setDataHoraAtual] = useState('');

    // Chave da API e URL
    const api_key = "7390a3ebcad0412a96a161627252907";
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cidade}&lang=pt`;

    async function buscarClima() {
        if (!cidade) return;

        try {
            const resposta = await axios.get<WeatherResponse>(url);

            // Busacando as informações com base na cidade
            setTemperatura(resposta.data.current.temp_c);
            setDescricao(resposta.data.current.condition.text);
            setUmidade(resposta.data.current.humidity);
            setVelocidadeVento(resposta.data.current.wind_kph);
            setSensacaoTermica(resposta.data.current.feelslike_c);
            setUltimaAtualizacao(resposta.data.current.last_updated);
            setIcone(resposta.data.current.condition.icon);
            setDataHoraAtual(resposta.data.location.localtime);

            setNomeCidade(resposta.data.location.name);
            setError("");
        } catch {
            setError("Cidade não encontrada.");
            setTemperatura(null);
            setUmidade(null);
            setNomeCidade("");
        }
    }

    function formatDateTime(date: Date) {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();

        const hora = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
    }

    return (
        <div style={{padding: '20px', textAlign: 'center'}}>
            <h2>Temperatura</h2>

            <input type="text" placeholder="Digita a cidade:" value={cidade} onChange={(e) => setCidade(e.target.value)} style={{padding: '8px', fontSize: '16px'}}/>
            <button onClick={buscarClima} style={{padding: '8px 16px', marginLeft: '10px'}}>Buscar</button>

            {temperatura !== null && (<p style={{marginTop: '20px'}}>Temperatura em {nomeCidade}: {temperatura} ºC</p>)}
            {descricao && (<p style={{marginTop: '20px'}}>O clima está: {descricao}</p>)}
            {umidade !== null && (<p style={{marginTop: '20px'}}>Umidade em {nomeCidade}: {umidade}%</p>)}
            {velocidadeVento !== null && (<p style={{marginTop: '20px'}}>Velocidade do vento em {nomeCidade}: {velocidadeVento}</p>)}
            {sensacaoTermica !== null && (<p style={{marginTop: '20px'}}>Sensação térmica em {nomeCidade}: {sensacaoTermica} ºC</p>)}
            {ultimaAtualizacao && (<p style={{marginTop: '20px'}}>Última atualização: {ultimaAtualizacao}</p>)}
            {icone && (<img src={`https:${icone}`} alt="Icone do clima" style={{marginTop: '20px'}}/>)}
            {DataHoraAtual && (<p style={{marginTop: '20px'}}>Data e hora atual: {DataHoraAtual}</p>)}
            
            
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}