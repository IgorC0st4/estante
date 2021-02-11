import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, RefreshControl } from 'react-native';
import {
    FAB, Card, Button, Divider, ActivityIndicator,
    Dialog, Portal, List, Text
} from 'react-native-paper';

import styles from './styles';
import Database from '../../services/Database';

const db = new Database();

export default function Resumo() {
    const [resumo, setResumo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        gerarResumo();
    }, []);

    const gerarResumo = async () => {
        setIsLoading(true);
        var livros = [];
        try {
            livros = await db.getAllSortByDataInicio();
        } catch (error) {
            console.error(error);
        }

        var resumosTemporarios = [];

        let resumoAno = newResumoAno();
        for (let i = 0; i < livros.length; i++) {
            if (resumoAno.ano != getAno(livros[i].dataInicio)) {
                if (resumoAno.ano) {
                    resumosTemporarios.push(resumoAno);
                }
                resumoAno = newResumoAno();
                resumoAno.ano = getAno(livros[i].dataInicio);
            }
            resumoAno.quantidadeIniciados++;

            if (resumoAno.ano === getAno(livros[i].dataFim)) {
                resumoAno.quantidadeFinalizados++;
            }
        }

        resumosTemporarios.push(resumoAno);

        setResumo(resumosTemporarios);
        setIsLoading(false);
    };

    const getAno = (dataStr) => {
        return dataStr.split('/')[2];
    };

    const newResumoAno = () => {
        return ({
            ano: '',
            quantidadeFinalizados: 0,
            quantidadeIniciados: 0
        });
    };

    const onRefresh = React.useCallback(() => {
        gerarResumo();
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingPage}>
                <ActivityIndicator animating={isLoading} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.page}>
                <FlatList
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
                    data={resumo}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.espacamentoInferior}>
                            <Card.Title title={item.ano} />
                            <Card.Content>
                                <List.Item title={'Livros iniciados: ' + item.quantidadeIniciados} />
                                <List.Item title={'Livros finalizados: ' + item.quantidadeFinalizados} />
                            </Card.Content>
                            <Divider />
                        </Card>
                    )}
                >

                </FlatList>
            </SafeAreaView>
        );
    }
}