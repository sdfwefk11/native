import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [errorMsg, setErrorMsg] = useState(true);
  const [forecast, setForcast] = useState([]);
  const [city, setCity] = useState("Loading...");
  const WEATHER_API_KEY = "99960dd689032ddafd0fad2517955588";
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      const location = await Location.reverseGeocodeAsync(
        {
          latitude,
          longitude,
        },
        { useGoogleMaps: false }
      );
      setCity(location);
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${WEATHER_API_KEY}&units=metric`
      );
      const json = await response.json();
      setForcast(json.daily);
    })();
  }, []);
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName1}>{city[0].region}</Text>
          <Text style={styles.cityName2}>{city[0].district}</Text>
        </View>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}
        >
          {forecast.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color="#FF66FF" size="large" />
            </View>
          ) : (
            forecast.map((item, index) => (
              <View key={index} style={styles.day}>
                <View style={styles.tempView}>
                  <Text style={styles.temp}>
                    {parseFloat(item.temp.day).toFixed(1)}
                  </Text>
                  <View style={styles.miniTempView}>
                    <Text style={styles.miniTemp}>
                      morning {parseFloat(item.temp.morn).toFixed(1)}
                    </Text>
                    <Text style={styles.miniTemp}>
                      night {parseFloat(item.temp.night).toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.weatherMain}>{item.weather[0].main}</Text>
                <Text style={styles.weatherDescription}>
                  {item.weather[0].description}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CBE7F1",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName1: {
    fontSize: 68,
    fontWeight: "500",
  },
  cityName2: {
    fontSize: 40,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  tempView: {
    flexDirection: "row",
  },
  miniTempView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginLeft: 10,
  },
  temp: {
    marginTop: 100,
    fontSize: 150,
  },
  miniTemp: {},

  weatherMain: {
    fontSize: 40,
  },
  weatherDescription: {
    marginTop: 20,
  },
});
