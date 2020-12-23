import React from 'react';
import { StyleSheet, View} from 'react-native';
import Weather from './components/Weather'

export default function App() {
  
  return (
    <View style={styles.container}>
      <Weather />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 2,
    margin:20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 89,
    height: 89,
    marginBottom: 10,
  },
  button: {
    minWidth: 200,
    alignItems:'center',
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  textBox: {
    height: 40, 
    width: 200,
    padding: 10,
    borderColor: 'gray', 
    borderWidth: 1 
  },
  search: {
    marginTop: 50,
    margin:10,
  },
  dayForecast: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: 'center',
  }
});
