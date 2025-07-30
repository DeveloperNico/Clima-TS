import styles from "./PaginaPrincipal.module.css";
import { useState } from "react";
import axios from "axios";

export function PaginaPrincipal() {
    return (
        <div className={styles.container}>
            <div className={styles.leftCard}>
                <h1 className={styles.titulo}>Bem-vindo ao Clima App</h1>
                <p className={styles.descricao}>Aqui você pode consultar as condições climáticas atuais de qualquer cidade do mundo.</p>
                <p className={styles.instrucoes}>Digite o nome da cidade no campo de busca para obter as informações climáticas.</p>
            </div>
            <div className={styles.rightCard}>
                <h1 className={styles.titulo}>Bem-vindo ao Clima App</h1>
                <p className={styles.descricao}>Aqui você pode consultar as condições climáticas atuais de qualquer cidade do mundo.</p>
                <p className={styles.instrucoes}>Digite o nome da cidade no campo de busca para obter as informações climáticas.</p>
            </div>
        </div>
    )
}