import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Button, TextInput, ActivityIndicator } from 'react-native-paper';

import styles from './styles';
import Database from '../../services/Database';

const db = new Database();

export default function EditarLivro() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const [titulo, setTitulo] = useState(item.titulo);
    const [dataInicio, setDataInicio] = useState(item.dataInicio);
    const [dataFim, setDataFim] = useState(item.dataFim);
    const [sinopse, setSinopse] = useState(item.sinopse);
    const [review, setReview] = useState(item.review);
    const [avaliacao, setAvaliacao] = useState(item.avaliacao.toString());
    const [capa, setCapa] = useState(item.capa);
    const [isLoading, setIsLoading] = useState(false);

    const salvar = () => {
        var livro = {
            id:item.id,
            titulo: titulo,
            dataInicio: dataInicio,
            dataFim: dataFim,
            sinopse: sinopse,
            review: review,
            avaliacao: parseInt(avaliacao),
            capa: capa
        }

        if (livro.titulo === '') {
            alert('Preencha pelo menos o título');
            return;
        }

        setIsLoading(true);
        db.update(livro).then((result) => {
            console.log(result);
            setIsLoading(false);
            navigation.goBack();
        }).catch((error) => {
            console.error(error);
            setIsLoading(false);
        });
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingPage}>
                <ActivityIndicator animating={isLoading} />
            </SafeAreaView>
        );
    } else {
        return (
            <ScrollView style={styles.page}>
                <Card>
                    <Card.Title title="Dados" />
                    <Card.Content>
                        <TextInput
                            label="Título"
                            style={styles.espacamentoInferior}
                            value={titulo}
                            onChangeText={setTitulo}
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Data Início"
                            placeholder="dd/MM/AAAA"
                            style={styles.espacamentoInferior}
                            value={dataInicio}
                            onChangeText={setDataInicio}
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Data Fim"
                            placeholder="dd/MM/AAAA"
                            style={styles.espacamentoInferior}
                            value={dataFim}
                            onChangeText={setDataFim}
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Sinopse"
                            style={styles.espacamentoInferior}
                            value={sinopse}
                            onChangeText={setSinopse}
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Review"
                            style={styles.espacamentoInferior}
                            value={review}
                            onChangeText={setReview}
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Avaliação"
                            style={styles.espacamentoInferior}
                            value={avaliacao}
                            onChangeText={setAvaliacao}
                            keyboardType='number-pad'
                            returnKeyType="next"
                        />
                        <TextInput
                            label="Capa"
                            style={styles.espacamentoInferior}
                            value={capa}
                            onChangeText={setCapa}
                        />
                        <Button onPress={salvar} mode='contained'>Salvar</Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }
}