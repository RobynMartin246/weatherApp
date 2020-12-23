import React from 'react';
import { ActivityIndicator, TextInput, Image, StyleSheet, TouchableOpacity, Text, View, FlatList } from 'react-native';


export default function Weather() {
    const [text, setText] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isLoadingForecast, setIsLoadingForecast] = React.useState(false)
    const [forecast, setForecast] = React.useState([])
    
    const SearchButton= ({location}) => {
      return(
        <TouchableOpacity
          onPress={() => {
            getWeatherForecast(location)
            setSearchResults(location)
          }}
          style={styles.buttonClear}>
          <Text style={styles.buttonClearText}>{location.key}</Text>
        </TouchableOpacity>
      )
    }
    
    async function onSubmit(text) {
      if (!text || text === null || text === "") {
        return false;
      }
      const queryString = text.trim().replace(/\s/g, '-')
      const url = `https://nominatim.openstreetmap.org/search?q=${queryString}&format=json`
      const results = []
      try {
        let response = await fetch(url);
        let json = await response.json();
        json.map(result => {
          results.push({
            key: result.display_name,
            lat: result.lat,
            lon: result.lon
          })
        })
        setSearchResults(results)
      } catch (error) {
        console.error(error)
      } 
    }
    
    async function getWeatherForecast(location){
        setIsLoadingForecast(true);
        const pointUrl = `https://api.weather.gov/points/${location.lat},${location.lon}`
        const fiveDayForecast = []
        try {
            const pointResponse = await fetch(pointUrl);
            const pointJson = await pointResponse.json();
            const forecastUrl = await pointJson?.properties.forecast;
            const getForecast = await fetch(forecastUrl);
            const forecastJson = await getForecast.json()
            forecastJson?.properties.periods.map(day =>{
            fiveDayForecast.push({
                key: day.name,
                temp: day.temperature + day.temperatureUnit,
                img: day.icon,
                shortForecast: day.shortForecast,
                details: day.detailedForecast,
            })
            })
            setForecast(fiveDayForecast)
            return fiveDayForecast
        } catch(error) { 
            console.error(error)
            return error
        } finally {setIsLoadingForecast(false)}
    }

    return (
      <View style={styles.container}>
        {(!isLoadingForecast && forecast.length < 1) ?
            <View style={styles.container}> 
                <Text style={{fontSize:20, marginBottom: 30, fontWeight:'bold'}}>NOAA Weather Forecast</Text>
                <TextInput
                    style={styles.textBox}
                    onChangeText={text => setText(text)}
                    onSubmitEditing={() => {
                        onSubmit(text);
                        setText(null);
                    }}
                    blurOnSubmit
                    placeholder="Enter Location"
                    value={text}
                />

                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity 
                        style={styles.buttonClear} 
                        onPress={()=>{
                            setSearchResults([])
                            setText('')
                            }}
                        >
                        <Text style={styles.buttonClearText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={()=> onSubmit(text)}
                    >
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            
                {searchResults.length > 0 &&  
                    <View style={styles.search}>
                        <Text style={{fontSize:20, fontWeight:'bold'}}>Select a location:</Text>
                        
                        <FlatList
                        data={searchResults}
                        renderItem={({item}) => <SearchButton location={item} />}
                        />
                        
                    </View>
                } 
            </View> : 
            <Forecast 
                isLoading={isLoadingForecast}
                forecast={forecast}
                searchLocation={searchResults.key}
                setForecast={setForecast}
                setSearchResults={setSearchResults}
            />
        }
        </View>
)}

function Forecast({isLoading, forecast, searchLocation, setForecast, setSearchResults}) {
    if (isLoading){
        return (
            <View>
                <Text>Going to space, be back soon!</Text>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        )
    }
    if (!forecast){
        return (
            <View>
                <Text>Oh... they don't get weather in {searchLocation}</Text>
                    <TouchableOpacity style={styles.button} onPress={()=>{
                        setForecast([])
                        setSearchResults([])}}>
                    <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return(
    <View style={styles.dayForecast}>
        <Text style={{fontSize:20, fontWeight:'bold'}}>NOAA Weather Forecast</Text>
        <Text style={{fontSize:18, textAlign:'center', marginBottom: 20}}>{searchLocation}</Text>
        <FlatList
            data={forecast}
            renderItem={({item}) => <DayForecast data={item} />}
        />
        
        <TouchableOpacity style={[styles.buttonClear, styles.buttonBig]} onPress={()=>{
            setForecast([])
            setSearchResults([])}}>
        <Text style={styles.buttonClearText}>Clear</Text>
        </TouchableOpacity>
    </View>
    )
}

function DayForecast({data}) {
    return (
      <View style={{margin:10, alignItems:'center',}}>
        <Image source={{uri: data.img}} style={styles.logo} />
        <Text style={{fontWeight: 'bold', fontSize: 18}}>{data.key}</Text>
        <Text style={{padding:5}}>{data.temp}</Text>
        <Text>{data.details}</Text>
      </View>
    )
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
      width: 120,
      height: 120,
      marginBottom: 10,
    },
    button: {
      minWidth: 100,
      alignItems:'center',
      borderWidth: 2,
      backgroundColor: "gray",
      borderColor: "gray",
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    buttonBig: {
        width: 200
    },

    buttonClear: {
        minWidth: 100,
        alignItems:'center',
        borderWidth: 2,
        borderColor: "gray",
        padding: 10,
        borderRadius: 5,
        margin: 10,
      },

    buttonText: {
      fontSize: 20,
      color: '#fff',
    },
    buttonClearText: {
        fontSize: 20,
        color: '#282828',
      },

    textBox: {
      height: 40, 
      width: 200,
      padding: 10,
      borderColor: 'black', 
      borderWidth: 1 
    },
    search: {
        flex:2,
        marginTop: 50,
        margin:10,
    },
    dayForecast: {
      justifyContent: "center",
      alignItems: 'center',
    }
  });
  