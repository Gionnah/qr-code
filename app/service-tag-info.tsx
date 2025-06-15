import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import inventoryData from '../assets/data/inventory.json';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export default function BadgeInfoScreen() {
  const { serviceTag } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const asset = inventoryData.find(item => item.serviceTag === serviceTag);

  useEffect(() => {
    if (!asset) {
      setModalVisible(true);
      const timeout = setTimeout(() => {
        setModalVisible(false);
        router.replace('/');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [asset]);

  if (!asset) {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Ionicons name="warning" size={50} color="#e74c3c" />
              <Text style={styles.modalTitle}>Service Tag not found</Text>
              <Text style={styles.modalMessage}>
                No equipment is associated with this tag: {serviceTag}
              </Text>
              <ActivityIndicator size="large" color="#6e45e2" style={{ marginTop: 20 }} />
              <Text style={styles.modalFooter}>Redirecting...</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const user = {
    firstName: asset.firstName,
    lastName: asset.lastName,
    position: asset.jobTitle,
    department: asset.avyNDepartment,
    company: asset.company,
    email: asset.mail,
    contact: asset.mobile,
    image: "",
    address: { city: asset.workLocationDescription },
    badgeId: asset.badgeId,
    assetTag: asset.assetTag,
    modelName: asset.modelName,
    assetType: asset.assetTypeName,
    manufacturer: asset.manufacturerName,
    area: asset.areaName,
    observation: asset.observation,
    inventoryDate: asset.inventoryDate,
  };

  return (
    <View style={styles.container}>
      {/* Fixed background with angle */}
      <LinearGradient
  colors={['#4F46E5', '#7C3AED']}
  style={styles.fixedHeader}
  start={{ x: 1, y: 0 }}
  end={{ x: 0, y: 1 }}
/>


      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header content */}
        <LinearGradient
  colors={['#fff', 'blue']}
  style={styles.fixedBackground}
  start={{ x: 1, y: 0 }}
  end={{ x: 0, y: 1 }}
/>

        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={user.image ? { uri: user.image } : require('../assets/images/default-image.jpg')}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.position}>{user.position}</Text>
            
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>ID: {user.badgeId}</Text>
            </View>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Professional Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="work" size={24} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </View>
            <View style={styles.sectionContent}>
              <InfoRow icon="business" iconLib="Ionicons" label="Company" value={user.company} />
              <InfoRow icon="department" iconLib="MaterialIcons" label="Department" value={user.department} />
              <InfoRow icon="email" iconLib="MaterialIcons" label="Email" value={user.email} />
            </View>
          </View>

          {/* Contact Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={24} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Contact Details</Text>
            </View>
            <View style={styles.sectionContent}>
              <InfoRow icon="phone" iconLib="Feather" label="Phone" value={user.contact} />
              <InfoRow icon="map-pin" iconLib="Feather" label="Location" value={user.address.city} />
            </View>
          </View>

          {/* Equipment Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="desktop-classic" size={24} color="#4F46E5" />
              <Text style={styles.sectionTitle}>Equipment Details</Text>
            </View>
            <View style={styles.sectionContent}>
              <InfoRow icon="tag" iconLib="Feather" label="Asset Tag" value={user.assetTag} />
              <InfoRow icon="laptop" iconLib="Feather" label="Model" value={user.modelName} />
              <InfoRow icon="devices" iconLib="MaterialIcons" label="Type" value={user.assetType} />
              <InfoRow icon="factory" iconLib="MaterialCommunityIcons" label="Manufacturer" value={user.manufacturer} />
              <InfoRow icon="map-marker" iconLib="FontAwesome" label="Area" value={user.area} />
              <InfoRow icon="clipboard" iconLib="Feather" label="Notes" value={user.observation || 'None'} />
              <InfoRow icon="calendar" iconLib="Feather" label="Inventory Date" value={new Date(user.inventoryDate).toLocaleDateString()} />
            </View>
          </View>

          {/* Service Tag Badge */}
          <View style={styles.serviceTagContainer}>
            <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
            <Text style={styles.serviceTagText}>SERVICE TAG: {serviceTag}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, iconLib, label, value }: { 
  icon: string, 
  iconLib: 'Ionicons' | 'MaterialIcons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'Feather', 
  label: string, 
  value: string 
}) {
  // Définition des composants d'icônes avec des types explicites
  const iconComponents = {
    Ionicons: Ionicons as React.ComponentType<{ name: string; size: number; color: string }>,
    MaterialIcons: MaterialIcons as React.ComponentType<{ name: string; size: number; color: string }>,
    FontAwesome: FontAwesome as React.ComponentType<{ name: string; size: number; color: string }>,
    MaterialCommunityIcons: MaterialCommunityIcons as React.ComponentType<{ name: string; size: number; color: string }>,
    Feather: Feather as React.ComponentType<{ name: string; size: number; color: string }>,
  };

  const IconComponent = iconComponents[iconLib];

  // Icône par défaut si l'icône spécifiée n'est pas trouvée
  const DefaultIcon = () => <Feather name="info" size={20} color="#6B7280" />;

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        {IconComponent ? (
          <IconComponent name={icon} size={20} color="#6B7280" />
        ) : (
          <DefaultIcon />
        )}
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  fixedBackground: {
    position: 'absolute',
    width: '200%',
    height: height * 2, // pour être certain que ça couvre tout après rotation
    top: -100,
    right: -100,
    transform: [{ rotateZ: '-420deg' }],
    zIndex: -1,
  }, 
  fixedHeader:{
    position: 'absolute',
    width: '200%',
    height: height * 2, // pour être certain que ça couvre tout après rotation
    top: -100,
    right: -100,
    transform: [{ rotateZ: '-0deg' }],
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: '#4F46E5',
  },
  headerContent: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  position: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 10,
  },
  sectionContent: {
    paddingHorizontal: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 10,
  },
  serviceTagContainer: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  serviceTagText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalFooter: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
});