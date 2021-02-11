import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    FAB, Card, Button, Divider, ActivityIndicator,
    Dialog, Portal, List, Text
} from 'react-native-paper';

import styles from './styles';
import Database from '../../services/Database';

const db = new Database();

export default function Home() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [livros, setLivros] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [livroSelecionado, setLivroSelecionado] = useState({});

    useEffect(() => {
        getLivros();
    }, []);

    const getLivros = () => {
        setIsLoading(true);
        db.getAll().then((result) => {
            setLivros(result);
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
            setIsLoading(false);
        })
    }

    const excluirLivroSelecionado = () => {
        db.deleteById(livroSelecionado.id).then((result) => {
            getLivros();
            setShowDialog(false);
        }).catch((error) => {
            setShowDialog(false);
            console.error(error);
        });
    }

    const habilitarDialog = (item) => {
        setLivroSelecionado(item);
        setShowDialog(true);
    }

    const onRefresh = React.useCallback(() => {
        getLivros();
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
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
                    data={livros}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.espacoSimples}>
                            <Card.Title title={item.titulo} />
                            <Card.Cover source={{ uri: item.capa }} />
                            <Card.Content>
                                <List.Accordion title="Detalhes">
                                    <List.Item title={'Data Início: ' + item.dataInicio} />
                                    <List.Item title={'Data Fim: ' + item.dataFim} />
                                    <List.Item title={'Avaliação: ' + item.avaliacao} />
                                    <List.Item title={'Sinopse:'} />
                                    <Text style={styles.description}>{item.sinopse}</Text>
                                    <List.Item title={'Review:'} />
                                    <Text style={styles.description}>{item.review}</Text>
                                </List.Accordion>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => navigation.navigate('Editar Livro', { item })}>Editar</Button>
                                <Button onPress={() => habilitarDialog(item)}>Excluir</Button>
                            </Card.Actions>
                            <Divider />
                        </Card>
                    )}
                />
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('Novo Livro')}
                />

                <Portal>
                    <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                        <Dialog.Title>Deseja excluir {livroSelecionado.titulo}?</Dialog.Title>
                        <Dialog.Actions>
                            <Button mode='contained' onPress={() => excluirLivroSelecionado()}>Excluir</Button>
                            <Button onPress={() => setShowDialog(false)}>Cancelar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        );
    }

}