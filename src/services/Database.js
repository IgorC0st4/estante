import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const databaseName = 'LibraryDB.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'SQLite Library Database';
const databaseSize = 200000;

export default class Database {
    initDB() {
        let db;
        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    SQLite.openDatabase(
                        databaseName,
                        databaseVersion,
                        databaseDisplayname,
                        databaseSize
                    )
                        .then(DB => {
                            db = DB;
                            console.log("Database OPEN");
                            db.executeSql('SELECT 1 FROM Livro LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                db.transaction((tx) => {
                                    tx.executeSql(`CREATE TABLE IF NOT EXISTS 
                                    Livro (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                        titulo TEXT NOT NULL,
                                        dataInicio TEXT, 
                                        dataFim TEXT, 
                                        sinopse TEXT, 
                                        review TEXT, 
                                        avaliacao INTEGER, 
                                        capa TEXT);`);
                                }).then(() => {
                                    console.log("Table created successfully");
                                }).catch(error => {
                                    console.log(error);
                                });
                            });
                            resolve(db);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                });
        });
    };

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log("Database was not OPENED");
        }
    };

    getAll() {
        return new Promise((resolve) => {
            const livros = [];

            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * FROM Livro ORDER BY titulo`, []).then(([tx, result]) => {
                        console.log('Query completed');
                        var len = result.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = result.rows.item(i);
                            livros.push(row);
                        }
                        resolve(livros);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    insert(livro) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO Livro (titulo, dataInicio, dataFim, sinopse, review, avaliacao, capa) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [livro.titulo, livro.dataInicio, livro.dataFim, livro.sinopse,
                        livro.review, livro.avaliacao, livro.capa]).then(([tx, result]) => {
                            resolve(result);
                        });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    getById(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * from Livro where id = ?`, [id]).then(([tx, result]) => {
                        if (result.rows.length > 0) {
                            let row = result.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    getLimiteAnos() {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT MAX(dataInicio) as maxDataInicio, 
                    MIN(dataInicio) as minDataInicio, MAX(dataFim) as maxDataFim 
                    FROM Livro`, []).then(([tx, result]) => {
                        if (result.rows.length > 0) {
                            let row = result.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    getAllSortByDataInicio(){
        return new Promise((resolve) => {
            const livros = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * FROM Livro ORDER BY dataInicio`, []).then(([tx, result]) => {
                        console.log('Query completed');
                        var len = result.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = result.rows.item(i);
                            livros.push(row);
                        }
                        resolve(livros);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    getNumeroDeLivrosIniciadosByAno(ano, db) {
        return new Promise((resolve) => {
            db.transaction((tx) => {
                let intervaloInferior = "01/01/" + ano;
                let intervaloSuperior = "31/12/" + ano;
                tx.executeSql(`SELECT COUNT(dataInicio) as quantidadeIniciados 
                    FROM Livro WHERE dataInicio BETWEEN ? and ?`, [intervaloInferior, intervaloSuperior])
                    .then(([tx, result]) => {
                        if (result.rows.length > 0) {
                            let row = result.rows.item(0);
                            resolve(row);
                        }
                    });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    getNumeroDeLivrosFinalizadosByAno(ano, db) {
        return new Promise((resolve) => {
            db.transaction((tx) => {
                let intervaloInferior = "01/01/" + ano;
                let intervaloSuperior = "31/12/" + ano;
                tx.executeSql(`SELECT COUNT(dataFim) as quantidadeFinalizados 
                    FROM Livro WHERE dataFim BETWEEN ? and ?`, [intervaloInferior, intervaloSuperior])
                    .then(([tx, result]) => {
                        if (result.rows.length > 0) {
                            let row = result.rows.item(0);
                            resolve(row);
                        }
                    });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });

    }

    deleteById(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM Livro WHERE id=?`, [id]).then(([tx, result]) => {
                        console.log(result);
                        resolve(result);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    update(livro) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`UPDATE Livro SET titulo=?, dataInicio=?,
                    dataFim=?, sinopse=?, review=?, avaliacao=?, capa=? WHERE id=?`,
                        [livro.titulo, livro.dataInicio, livro.dataFim, livro.sinopse,
                        livro.review, livro.avaliacao, livro.capa, livro.id]).then(([tx, result]) => {
                            resolve(result);
                        });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

}