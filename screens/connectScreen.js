import { StyleSheet, View } from "react-native";
import { Button, Title, Card } from "react-native-paper";
import Connect2Phantom from "../components/connect2phantom";


export default function ConnectScreen({navigation}){
  return (
  <View style={styles.container}>
  <View style={styles.row}>
  <Card>
          <Card.Title title="Connect to Phantom Wallet" subtitle="devnet" titleStyle={styles.text}/>
          </Card>
  </View>
  <View style={styles.row}>
  <View style={{padding:10}} ></View>
    <Connect2Phantom></Connect2Phantom>
    <View style={{padding:10}} ></View>
    <Button
      mode="contained"
      color='white'
      title="Go back"
      onPress={() => navigation.goBack()}
      >Navigate back</Button>
    </View>
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
