import * as Location from 'expo-location';
import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const API_KEY = "4a1db5262afd441bb019a6bb175bbab3";
const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lighting",
};
export default function App() {
    const [city, setCity] = useState("loading...");
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeatger = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const { coords: {latitude, longitude}} = await  Location.getCurrentPositionAsync({accuracy:5});
        const location = await Location.reverseGeocodeAsync({latitude, longitude});

        setCity(location[0].region);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&exclude=alerts&units=metric`);
        const json = await response.json();
        setDays(json.daily);

    }
    useEffect(() => {
        getWeatger();
    }, []);

    return <View style={styles.container}>
        <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weather}
        >
            {days.length === 0 ?
                <View style={{ ...styles.day, alignItems: "center"}}>
                    <ActivityIndicator color="white" style={{marginTop: 10}} size="large"/>
                </View>
                :
                days.map((day, index) =>
                    <View key={index} style={styles.day}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.temp}>
                                {parseFloat(day.temp.day).toFixed(1)}
                            </Text>
                            <Fontisto name={icons[day.weather[0].main]} size={50} color="white" />
                        </View>

                        <Text style={styles.description}>{day.weather[0].main}</Text>
                        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                    </View>
                )
            }
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 68,
        fontWeight: "500",
        color: "white",
    },
    day: {
        width: SCREEN_WIDTH,
        alignItems: "left",
    },
    temp: {
        marginTop: 50,
        fontSize: 100,
        color: "white",
    },
    description: {
        marginTop: -30,
        fontSize: 60,
        color: "white",
    },
    tinyText: {
        fontSize: 20,
        color: "white",
    },
});
