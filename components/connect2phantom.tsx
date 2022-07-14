import React, { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Button, Card } from "react-native-paper";
import { StyleSheet} from "react-native";


type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: ()=>Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=>void) => void;
    isPhantom: boolean;
}

type WindowWithSolana = Window & {
    solana?: PhantomProvider;
}



export default function Connect2Phantom() {

    const [ walletAvail, setWalletAvail ] = useState(false);
    const [ provider, setProvider ] = useState<PhantomProvider | null>(null);
    const [ connected, setConnected ] = useState(false);
    const [ pubKey, setPubKey ] = useState<PublicKey | null>(null);


    useEffect( ()=>{
        if ("solana" in window) {
            const solWindow = window as WindowWithSolana;
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow.solana);
                setWalletAvail(true);
                // Attemp connection (previously connected)
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);

    useEffect( () => {
        provider?.on("connect", (publicKey: PublicKey)=>{
            console.log(`connect event: ${publicKey}`);
            setConnected(true);
            setPubKey(publicKey);
        });
        provider?.on("disconnect", ()=>{
            console.log("disconnect event");
            setConnected(false);
            setPubKey(null);
        });

    }, [provider]);

    function connectHandler1 (){
        provider?.connect()
        .catch((err) => { console.error("connect ERROR:", err); });
    }

    function disconnectHandler1 (){
        provider?.disconnect()
        .catch((err) => {console.error("disconnect ERROR:", err); });
    }


    return (
        <div>
        { walletAvail ?
            <>
                <Button mode="contained" color="black" disabled={connected} onPress={connectHandler1}>Connect to Phantom</Button>
                <p></p>
                <Button mode="contained" color="black" disabled={!connected} onPress={disconnectHandler1}>Disconnect</Button>
                <p></p>
                    { connected ?
                        <Card>
                            <Card.Title title="Connected to: " subtitle={pubKey?.toBase58()} titleStyle={styles.text}/>
                        </Card>
                    : null
                    }
            </>
        :
            <>
            <p>No Phantom installed. <a href="https://phantom.app/">https://phantom.app/</a>.</p>
            </>
        }



        </div>

    );
}

//export default Connect2Phantom;

/*
  <button disabled={connected} onClick={connectHandler}>Connect to Phantom</button>
  <button disabled={!connected} onClick={disconnectHandler}>Disconnect from Phantom</button>
*/

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

});
