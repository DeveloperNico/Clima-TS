import styles from "./PaginaPrincipal.module.css";
import { useState } from "react";
import axios from "axios";

import { Search } from "lucide-react";
// Importando todos os icones
import iconeDia from '../../assets/Icones/Dia.png';
import iconeDiaParcialmenteNublado from '../../assets/Icones/Dia-parcialmente-nublado.jpg';
import iconeNublado from '../../assets/Icones/Nublado.png';
import iconeNevoeiro from '../../assets/Icones/Nevoeiro.png';
import iconeChuvaFraca from '../../assets/Icones/Chuva-fraca.png';
import iconePossibilidadeChuva from '../../assets/Icones/Possibilidade-chuva.jpg';

interface WeatherResponse {
    location: {
        name: string;
        country: string;
        tz_id: string;
    };

    current: {
        temp_c: number;
        condition: {
            text: string;
        }
        last_updated_epoch: number;
    };
}

export function PaginaPrincipal() {
    const [cidade, setCidade] = useState('');
    const [nomePais, setNomePais] = useState('');
    const [nomeCidade, setNomeCidade] = useState('');
    const [error, setError] = useState('');
    const [temperatura, setTemperatura] = useState <number | null>(null);
    const [descricao, setDescricao] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [imagemCidade, setImagemCidade] = useState<string | null>(null);

    // Chave da API e URL
    const api_key = "7390a3ebcad0412a96a161627252907";
    const unsplash_key = "OofVb_f66byugffRDYq0IfViKMn1zc2-AMGDDRcBgsM";
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cidade}&lang=pt`;

    // Função para calcular o dia da semana e a hora com base no fuso horário
    function calcularHoraLocal(timestamp: number, fusoHorario: string) {
        const date = new Date(timestamp * 1000); // Converte o timestamp para Date
        const opcoes = {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: fusoHorario,
        };

        const formatter = new Intl.DateTimeFormat('pt-BR', opcoes);
        const dataFormatada = formatter.format(date);
        
        return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    }

    // Buscar imagem de uma cidade
    async function buscarImagemCidade(cidade: string) {
        const urlUnsplash = `https://api.unsplash.com/search/photos?query=${cidade}&client_id=${unsplash_key}&orientation=landscape&per_page=1`;

        try {
            const resposta = await axios.get(urlUnsplash);
            const imagem = resposta.data.results[0];
            return imagem?.urls?.regular;
        } catch (erro) {
            console.error("Erro ao buscar imagem: ", erro);
            return null;
        }
    }

    async function buscarClima() {
        if (!cidade) return;

        try {
            const resposta = await axios.get<WeatherResponse>(url);

            // Buscar informações com base na cidade
            setTemperatura(resposta.data.current.temp_c);
            setDescricao(resposta.data.current.condition.text);
            setNomeCidade(resposta.data.location.name);

            const nomePaisAPI = resposta.data.location.country;
            if (nomePaisAPI === "United States of America") {
                setNomePais("USA");
            } else {
                setNomePais(nomePaisAPI);
            };

            // Buscar a data e a hora com base na cidade
            const horaLocal = calcularHoraLocal(resposta.data.current.last_updated_epoch, resposta.data.location.tz_id);
            setDataHora(horaLocal);

            // Bucar imagem da cidade
            const imagem = await buscarImagemCidade(resposta.data.location.name);
            setImagemCidade(imagem);
        } catch {
            setError("Cidade não encontrada!");
            setTemperatura(null);
            setDescricao('');
            setNomeCidade("");
            setNomePais("");
            setImagemCidade(null);
        }
    }

    // Função para pegar corretamente cada ícone
    function obterIconeClima(descricao: string) {
        const descricaoLower = descricao.toLocaleLowerCase();

        // Checagens mais específicas primeiro
        if (descricaoLower === "sol" || descricaoLower === "ensolarado") {
            return iconeDia;
        }
        if (descricaoLower === "parcialmente nublado") {
            return iconeDiaParcialmenteNublado;
        }
        if (descricaoLower === "nublado") {
            return iconeNublado;
        }
        if (descricaoLower === "encoberto") {
            return iconeNublado;
        }
        if (descricaoLower === "céu limpo" || descricaoLower === "ensolarado") {
            return iconeDia;
        }
        if (descricaoLower === "nevoeiro" || descricaoLower === "neblina") {
            return iconeNevoeiro;
        }
        if (descricaoLower === "chuva fraca" || descricaoLower === "chuva moderada") {
            return iconeChuvaFraca;
        }
        if (descricaoLower === "possibilidade de chuva irregular") {
            return iconePossibilidadeChuva;
        }

        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftCard}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} onClick={buscarClima}/>
                    <input 
                        className={styles.input} 
                        type="text" 
                        placeholder="Pesquise uma cidade . . ." 
                        value={cidade} 
                        onChange={(e) => setCidade(e.target.value)}
                    />
                </div>
                <div>
                    {descricao && (
                        <div className={styles.iconeClima}>
                            {obterIconeClima(descricao) && (
                                <img 
                                    src={obterIconeClima(descricao)!} 
                                    alt="Icone de clima"
                                />
                            )}
                        </div>
                    )}
                    {temperatura !== null && (
                        <div className={styles.temperatura}>
                            <p>{temperatura}</p>
                            <p className={styles.celsius}>ºC</p>
                        </div>
                    )}
                    {dataHora && 
                        <div className={styles.containerDataHora}>
                            <p className={styles.dataHora}>{dataHora}</p>
                        </div>
                    }
                    {imagemCidade && (
                        <div className={styles.imagemContainer}>
                            <div className={styles.imagemContent}>
                                <img className={styles.imagemCidade} src={imagemCidade} alt={`Imagem de ${nomeCidade}`}/>
                                <div className={styles.overlay}>
                                    <p className={styles.textoOverlay}>{nomeCidade}, {nomePais}</p>
                                </div>
                            </div>
                        </div>
                    )}  
                </div>
            </div>
            <div className={styles.rightCard}>
                <h1 className={styles.titulo}>Bem-vindo ao Nimbus</h1>
                <p className={styles.descricao}>Aqui você pode consultar as condições climáticas atuais de qualquer cidade do mundo.</p>
                <p className={styles.instrucoes}>Digite o nome da cidade no campo de busca para obter as informações climáticas.</p>
            </div>
        </div>
    )
}