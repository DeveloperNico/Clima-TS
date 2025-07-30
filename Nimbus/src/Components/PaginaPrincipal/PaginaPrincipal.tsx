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
    };

    current: {
        temp_c: number;
        condition: {
            text: string;
        }
    };
}

export function PaginaPrincipal() {
    const [cidade, setCidade] = useState('');
    const [nomeCidade, setNomeCidade] = useState('');
    const [error, setError] = useState('');
    const [temperatura, setTemperatura] = useState <number | null>(null);
    const [descricao, setDescricao] = useState('');

    // Chave da API e URL
    const api_key = "7390a3ebcad0412a96a161627252907";
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cidade}&lang=pt`;

    async function buscarClima() {
        if (!cidade) return;

        try {
            const resposta = await axios.get<WeatherResponse>(url);

            // Buscar informações com base na cidade
            setTemperatura(resposta.data.current.temp_c);
            setDescricao(resposta.data.current.condition.text);

            setNomeCidade(resposta.data.location.name);
            setError("");
        } catch {
            setError("Cidade não encontrada!");
            
            setTemperatura(null);
            setDescricao('');

            setNomeCidade("");
        }
    }

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
        if (descricaoLower === "chuva fraca") {
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
                    {temperatura !== null && (<p style={{marginTop: '20px'}}>Temperatura em {nomeCidade}: {temperatura} ºC</p>)}
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