
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Title, Card, Paragraph } from "react-native-paper";
import base58 from 'bs58';

import {
  Connection, //Connection to accept an endpoint parameter with url from fullnode
  clusterApiUrl,
  Keypair,    //Library to create Public/Private key
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const BTN_TEXT = "Request Airdrop";
const BTN_TEXT_LOADING = "Requesting Airdrop...";

export default function HomeScreen({navigation}) {

  const [account, setAccount] = useState({ keypair: null, balance: 0 });
  const [requestAirdropButton, setRequestAirdropButton] = useState({
    text: BTN_TEXT,
    loading: false,
  });



  const createConnection = () => {
    return new Connection(clusterApiUrl("devnet")); //"testnet" or "mainnet-beta" possible

  };

  const createAccount = () => {
    const bs58 = require('bs58');

    const keypair = Keypair.generate();
    const pubKey = account?.keypair?.publicKey?.toBase58();
    const privKey = bs58.encode(keypair.secretKey);

    console.log("pub: ", pubKey);
    console.log("priv: ", privKey);

    setAccount({keypair: keypair, balance: 0});
  };

  //get public key as param
  //create connection
  //lamport variable to store balance result of function getBalance with corresponding public key
  //1 Lamport = 1 billion --> divide result by LAMPORTS_PER_SOL
  const getBalance = async (publicKey) => {
    const conn = createConnection();

    const lamports = await conn.getBalance(publicKey).catch((_err) => {
      console.error('Error: ${_err}');
    });

    return lamports / LAMPORTS_PER_SOL
  };

  //request devnet tokens
  const requestAirdrop = async (publicKey) => {
    //update button if clicked
    setRequestAirdropButton({text: BTN_TEXT_LOADING, loading: true});

    const conn = createConnection();
    const airdropSig = await conn.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );

    //define signature with the result of confirm tx
    const sig = await conn.confirmTransaction(airdropSig);

    const newBal = await getBalance(publicKey);

    //update ui if airdrop was successfull
    setAccount({ ...account, balance: newBal});
    setRequestAirdropButton({text:BTN_TEXT, loading: false})
  };

    // const getTransactions = async (publicKey) => {
      //const [tx, setTx] = useState(null);
    //   const conn = createConnection();
    //   let tx = await conn.getConfirmedSignaturesForAddress2(
    //     keypair.publicKey,{limit: 10},
    //   );
    //   setTx(tx);
    // }

  function copyPub(){
      const pubKey = account?.keypair?.publicKey?.toBase58();
      navigator.clipboard.writeText(pubKey);
  }
  function copyPriv(){
    const privKey = base58.encode(account?.keypair?.secretKey);
    navigator.clipboard.writeText(privKey);
  }

  return (
    <View style={styles.container}>
    {account.keypair ? (
      <>
    <View style={styles.row}>
      <Card>
          <Card.Title title="Solana created Keypair" subtitle="devnet" titleStyle={styles.text}/>
          <Card.Content>
            <Title>Public Key</Title>
            <Paragraph>{account?.keypair?.publicKey?.toBase58()}</Paragraph>
          </Card.Content>
          <Card.Content>
            <Title>Private Key (do not share)</Title>
            <Paragraph>{base58.encode(account?.keypair?.secretKey)}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => copyPub()} style={styles.text} >Copy Public Key</Button>
            <Button onPress={() => copyPriv()} >Copy Private Key</Button>
          </Card.Actions>
        </Card>
    </View>

    <View style={styles.row}>
      <Card>
            <Card.Title title="Balance on devnet" subtitle={account?.keypair?.publicKey?.toBase58()} titleStyle={styles.text}/>
            <Card.Content>
              <Title>{account?.balance} SOL</Title>
            </Card.Content>
      </Card>
    </View>

    <View style={styles.row}>
        <Button
          mode="contained"
          color='white'
          onPress={() => requestAirdrop(account.keypair.publicKey)}
          loading={requestAirdropButton.loading}
        >
          {requestAirdropButton.text}
        </Button>
        <View style={{padding:10}} ></View>
        <Button
          mode="contained"
          color='white'
          onPress={() => navigation.navigate('ConnectScreen')}
        >Connect Wallet
        </Button>
    </View>

      </>
    ) : (
    <View style={styles.row}>
      <Card>
        <Card.Title  title="Account doesn't exist" titleStyle={styles.text}></Card.Title>
      </Card>
    </View>
    )}
    <Button mode="contained" color="white" onPress={() => createAccount()}>
      Create New Account
    </Button>

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: "#690eef",
    fontSize: 20,
    fontWeight: "bold",

  },
  text1: {
    color: "#f4d47c",
    fontSize: 20,
    fontWeight: "bold",

  },
  sub_text: {
    color: "#bebebe",
    fontSize: 18,
   // fontWeight: "bold",

  },
  row: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 22,

  },
});
