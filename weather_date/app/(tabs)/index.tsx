import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// 🎨 Color Palette from Specifications
const COLORS = {
  deepCrimson: '#4A0E17',
  darkBurgundy: '#2A080C',
  metallicGold: '#D4AF37',
  pureWhite: '#FFFFFF',
  mediumGray: '#A3A3A3',
  translucentWhite: 'rgba(255, 255, 255, 0.07)',
  softWhiteBorder: 'rgba(255, 255, 255, 0.12)',
  translucentBlack: 'rgba(0, 0, 0, 0.2)',
};

export default function DashboardScreen() {
  // --- Live Clock State & Logic ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // --- Dynamic Weather State & API Handling ---
  const [weather, setWeather] = useState({
    temp: '31',
    condition: 'Partly Cloudy',
    humidity: '65',
    wind: '12',
    loading: true,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=14.07&longitude=120.63&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m'
        );
        const data = await response.json();
        
        if (data && data.current) {
          const code = data.current.weather_code;
          let conditionStr = 'Partly Cloudy';
          if (code === 0) conditionStr = 'Clear Sky';
          else if (code >= 1 && code <= 3) conditionStr = 'Partly Cloudy';
          else if (code >= 45 && code <= 48) conditionStr = 'Foggy';
          else if (code >= 51 && code <= 67) conditionStr = 'Rainy';
          else if (code >= 71 && code <= 86) conditionStr = 'Snowy';
          else if (code >= 95) conditionStr = 'Thunderstorm';

          setWeather({
            temp: Math.round(data.current.temperature_2m).toString(),
            condition: conditionStr,
            humidity: data.current.relative_humidity_2m.toString(),
            wind: Math.round(data.current.wind_speed_10m).toString(),
            loading: false,
          });
        }
      } catch (error) {
        console.error("Weather fetching failed, falling back to static specs:", error);
        setWeather((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 10000);
    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.deepCrimson, COLORS.darkBurgundy]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 📍 Location Header */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={COLORS.metallicGold} style={styles.iconMargin} />
            <Text style={styles.locationText}>NASUGBU BATANGAS, PH</Text>
          </View>

          {/* ⏰ Current Time Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={14} color={COLORS.metallicGold} style={styles.iconMargin} />
              <Text style={styles.cardTitle}>CURRENT TIME</Text>
            </View>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
          </View>

          {/* 🌤️ Weather Updates Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="help-circle-outline" size={14} color={COLORS.metallicGold} style={styles.iconMargin} />
              <Text style={styles.cardTitle}>WEATHER UPDATES</Text>
            </View>
            
            {weather.loading ? (
              <ActivityIndicator size="small" color={COLORS.metallicGold} style={{ marginVertical: 20 }} />
            ) : (
              <>
                <Text style={styles.tempText}>{weather.temp}°C</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
                
                {/* 🏷️ Modified Weather Sub-metrics Capsule Box */}
                <View style={styles.weatherMetricsContainer}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>HUMIDITY</Text>
                    <Text style={styles.metricValue}>{weather.humidity}%</Text>
                  </View>
                  
                  {/* 📏 Vertical Divider */}
                  <View style={styles.verticalDivider} />
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>WIND</Text>
                    <Text style={styles.metricValue}>{weather.wind} km/h</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ⚛️ Branding Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="react" size={14} color={COLORS.metallicGold} style={styles.iconMargin} />
              <Text style={styles.cardTitle}>REACT NATIVE</Text>
            </View>
            <Text style={styles.brandingText}>SIR MAGS</Text>
          </View>

          {/* 📝 Footer Text */}
          <View style={styles.footerContainer}>
            <MaterialCommunityIcons name="atom" size={10} color={COLORS.mediumGray} style={styles.iconMargin} />
            <Text style={styles.footerText}>REACT NATIVE • LIVE MONITORS</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  iconMargin: {
    marginRight: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  locationText: {
    color: COLORS.pureWhite,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.translucentWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.softWhiteBorder,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.translucentBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.metallicGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timeText: {
    color: COLORS.pureWhite,
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 4,
  },
  dateText: {
    color: COLORS.mediumGray,
    fontSize: 12,
    fontWeight: '400',
  },
  tempText: {
    color: COLORS.pureWhite,
    fontSize: 44,
    fontWeight: '200',
  },
  weatherCondition: {
    color: COLORS.pureWhite,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  // 🏷️ Updated Capsule layout block styling
  weatherMetricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.translucentBlack,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.softWhiteBorder,
    paddingVertical: 12,
    marginTop: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.softWhiteBorder,
  },
  metricLabel: {
    color: COLORS.mediumGray,
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  metricValue: {
    color: COLORS.pureWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  brandingText: {
    color: COLORS.pureWhite,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
  footerText: {
    color: COLORS.mediumGray,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
