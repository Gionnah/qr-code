import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export default function QRScanner() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      return () => setScanned(false);
    }, [])
  );

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <LinearGradient 
        colors={['#6e45e2', '#88d3ce']} 
        style={styles.permissionContainer}
      >
        <View style={styles.permissionContent}>
          <Ionicons name="camera" size={60} color="white" style={styles.cameraIcon} />
          <Text style={styles.permissionText}>We need access to your camera</Text>
          <Text style={styles.permissionSubText}>To scan QR codes</Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Allow access</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      router.push(`/service-tag-info?serviceTag=${data}`);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
        enableTorch={torchOn}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={styles.scanArea} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.scanText}>Scan the QR code </Text>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={toggleTorch}
            >
              <Ionicons 
                name={torchOn ? "flashlight" : "flashlight-outline"} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={toggleCameraFacing}
            >
              <Ionicons 
                name="camera-reverse-outline" 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  scanArea: {
    width: SCAN_SIZE - 4,
    height: SCAN_SIZE - 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#6e45e2',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 40,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    backgroundColor: 'rgba(110, 69, 226, 0.7)',
    padding: 15,
    borderRadius: 50,
  },
  // Styles pour la demande de permission
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    width: '80%',
    alignItems: 'center',
  },
  cameraIcon: {
    marginBottom: 30,
  },
  permissionText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: '#6e45e2',
    fontSize: 18,
    fontWeight: '600',
  },
});