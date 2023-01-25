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
import { Fontisto, Feather } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icon = {
  Clear: "day-sunny",
  Snow: "snowflake-8",
  Clouds: "cloudy",
  Atmosphere: "fog",
  Rain: "rain",
  Drizzle: "cloud-drizzle",
  Thunderstorm: "lightning",
};

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
              <ActivityIndicator color="black" size="large" />
            </View>
          ) : (
            forecast.map((item, index) => (
              <View key={index} style={styles.day}>
                <View style={styles.iconst}>
                  {item.weather[0].main === "Drizzle" ? (
                    <Feather
                      name={icon[item.weather[0].main]}
                      size={40}
                      color="black"
                    ></Feather>
                  ) : (
                    <Fontisto
                      name={icon[item.weather[0].main]}
                      size={40}
                      color="black"
                    />
                  )}
                </View>
                <View style={styles.tempView}>
                  <View style={styles.temp}>
                    <Text style={{ fontSize: 100 }}>
                      {parseFloat(item.temp.day).toFixed(1)}
                    </Text>
                  </View>
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
    marginTop: 100,
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
    marginTop: 10,
  },
  miniTempView: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  temp: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  weatherMain: {
    marginTop: 40,
    fontSize: 40,
  },
  weatherDescription: {
    marginTop: 20,
  },
  iconst: {
    flex: 0.2,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
