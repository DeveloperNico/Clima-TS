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
import iconeChuva from '../../assets/Icones/Icone-Chuva.svg';

interface WeatherResponse {
    location: {
        name: string;
        country: string;
        tz_id: string;
    };
    current: {
        temp_c: number;
        humidity: number;
        condition: {
            text: string;
        }
        last_updated_epoch: number;
    };
    forecast: {
        forecastday: {
            day: {
                daily_chance_of_rain: number;
                condition: {
                    text: string;
                };
                maxtemp_c: number;
                mintemp_c: number;
            }
        }[];
    };
}

export function PaginaPrincipal() {
    const [cidade, setCidade] = useState('');
    const [nomePais, setNomePais] = useState('');
    const [nomeCidade, setNomeCidade] = useState('');
    const [error, setError] = useState('');
    const [temperatura, setTemperatura] = useState <number | null>(null);
    const [umidade, setUmidade] = useState<number | null>(null);
    const [descricao, setDescricao] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [imagemCidade, setImagemCidade] = useState<string | null>(null);
    const [chanceChuva, setChanceChuva] = useState<number | null>(null);
    const [previsaoSemana, setPrevisaSemana] = useState<WeatherResponse["forecast"]["forecastday"]>([]);

    // Chave da API e URL
    const api_key = "7390a3ebcad0412a96a161627252907";
    const unsplash_key = "OofVb_f66byugffRDYq0IfViKMn1zc2-AMGDDRcBgsM";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${cidade}&lang=pt&days=7`;

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
            setUmidade(resposta.data.current.humidity);
            setNomeCidade(resposta.data.location.name);
            setPrevisaSemana(resposta.data.forecast.forecastday);

            if (resposta.data.current.condition.text === "Sol") {
                setDescricao("Ensolarado");
            } else {
                setDescricao(resposta.data.current.condition.text);
            }

            const nomePaisAPI = resposta.data.location.country;
            if (nomePaisAPI === "United States of America") {
                setNomePais("USA");
            } else {
                setNomePais(nomePaisAPI);
            };

            // Buscar a data e a hora com base na cidade
            const horaLocal = calcularHoraLocal(resposta.data.current.last_updated_epoch, resposta.data.location.tz_id);
            setDataHora(horaLocal);

            // Buscar possibilidade de chuva
            setChanceChuva(resposta.data.forecast.forecastday[0].day.daily_chance_of_rain);

            // Bucar imagem da cidade
            const imagem = await buscarImagemCidade(resposta.data.location.name);
            setImagemCidade(imagem);
        } catch {
            setError("Cidade não encontrada!");
            setTemperatura(null);
            setUmidade(null);
            setDescricao('');
            setNomeCidade("");
            setNomePais("");
            setDataHora("");
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
        if (descricaoLower === "chuva fraca" || descricaoLower === "chuva moderada" || descricaoLower === "chuvisco irregular" || descricaoLower === "aguaceiros fracos" || descricaoLower === "chuvisco") {
            return iconeChuvaFraca;
        }
        if (descricaoLower === "possibilidade de chuva irregular") {
            return iconePossibilidadeChuva;
        }

        return null;
    }

    function interpretarUmidade(umidade: number | null) {
        if (umidade === null) return '';

        if (umidade <= 30) {
            return 'Seco 🥵';
        } else if (umidade <= 60) {
            return 'Normal 🙂';
        } else if (umidade <= 80) {
            return 'Elevada 😐';
        } else {
            return 'Muito alta 😓';
        }
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                buscarClima();
                            }
                        }}
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
                    {descricao && 
                        <div className={styles.descricao}>
                            <p>{descricao}</p>
                        </div>
                    }
                    {chanceChuva !== null && (
                        <div className={styles.probabilidadeChuva}>
                            <img src={iconeChuva} alt="Icone de chuva" />
                            <p className={styles.chanceChuva}>Chance de chuva - {chanceChuva}%</p>
                        </div>
                    )}
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
                <div className={styles.cabecalho}>
                    <h2>Previsão da semana</h2>
                </div>
                <div className={styles.previsaoSemana}>
                    {previsaoSemana.map((dia, index) => {
                        const data = new Date(dia.date);
                        const nomeDia = data.toLocaleDateString('pt-BR', { weekday: 'long' });
                        const icone = obterIconeClima(dia.day.condition.text);

                        return (
                            <div className={styles.containerPrevisao}>
                                <p className={styles.nomeDia}>{nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1)}</p>
                                <div key={index} className={styles.card}>
                                    {icone && (
                                        <img
                                        src={icone}
                                        alt={`Ícone de clima para ${dia.day.condition.text}`}
                                        className={styles.iconeClimaPrevisao}
                                        />
                                    )}
                                    <div className={styles.temperaturaMaxMin}>
                                        <p className={styles.temperaturaMax}>{dia.day.maxtemp_c}º</p>
                                        <p className={styles.temperaturaMin}>{dia.day.mintemp_c}°</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.destaquesHoje}>
                    <h2>Destaques de hoje</h2>
                </div>
                <div className={styles.umidadeCard}>
                    <h3>Umidade</h3>
                    {umidade && (
                        <>
                            <div className={styles.umidade}>
                                <p className={styles.umidadeText}>{umidade}</p>
                                <p className={styles.porcentagem}>%</p>
                            </div>
                            <p className={styles.qualidadeAr}>{interpretarUmidade(umidade)}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}