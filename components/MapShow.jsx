import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { Button, Snackbar, IconButton, MD3Colors } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import * as Location from "expo-location"; // For location services
import * as Notifications from "expo-notifications";

export default function MapShow() {
  const [data, setData] = useState({ d: [], radius: [] });
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [notificationToken, setNotificationToken] = useState("");
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  // Request user location and handle permissions
  useEffect(() => {
    // Request permission to send notifications
    const requestPermissions = async () => {
      // Make sure you set your projectId here
      const projectId = "62f02d02-584a-477a-b2a8-f37081b7a900"; // Replace with your actual project ID

      // Check if the user has granted permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Only ask if permissions have not already been determined
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // If permission is not granted, return
      if (finalStatus !== "granted") {
        console.error("Failed to get push token for push notification!");
        return;
      }

      // Get the token
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      console.log(token);
      return token;
    };

    requestPermissions();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Start watching the user's location
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update location every 10 meters
          timeInterval: 1000, // Update location every second
        },
        (location) => {
          setUserLocation(location);
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          });
        }
      );
    })();

    return () => {
      // Stop watching location when component unmounts
      Location.stopLocationUpdatesAsync();
    };
  }, []);

  // Center map on user location
  const centerOnUserLocation = () => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    } else {
      Alert.alert("Location not available", "Please enable location services.");
    }
  };

  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Caution..!",
        body: "Accident zone ahead. Please be caution while crossing the zone..!",
        data: { someData: "goes here" }, // Data can be anything you want to pass along
      },
      trigger: { seconds: 2 }, // Notification will be triggered after 2 seconds
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.mapContainer}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        region={mapRegion}
        showsUserLocation={true} // Show user's location on the map
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >
        <Circle
          center={{ latitude: 13.0487495, longitude: 80.2778022 }}
          radius={15}
          fillColor="red"
        />
      </MapView>
      <IconButton
        icon="bell"
        mode="contained"
        iconColor={MD3Colors.error50}
        size={20}
        onPress={triggerNotification}
      />
      <IconButton
        icon="bell"
        mode="contained"
        iconColor={MD3Colors.error50}
        size={20}
        onPress={onToggleSnackBar}
      />
      {/* <Button mode="contained" onPress={triggerNotification}>
        Trigger Notification
      </Button>
      <Button mode="contained" onPress={onToggleSnackBar}>
        {visible ? "Hide" : "Show"}
      </Button> */}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Undo",
          onPress: () => {
            // Do something
          },
        }}
      >
        Caution..! Accident zone ahead. Please be caution while crossing the
        zone..!
      </Snackbar>
    </SafeAreaView>
  );
}

// Styles to position the map and floating button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  mapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    elevation: 5, // for shadow effect
  },
  buttonText: {
    fontSize: 24,
    textAlign: "center",
    color: "#000",
  },
});
