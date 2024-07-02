import { View, Text, Image, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { devicesRef, preferencesRef } from '../../firebaseConfig';
import Background from '../../components/Background';

export default function devices() {
  const router = useRouter();
  const {user} = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch devices from the collection/database to show 
    const fetchDevices = async () => {
      if (user) {
        const q = query(devicesRef, where('user_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedDevices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDevices(fetchedDevices);
        }
      }
      setLoading(false);
    };
    fetchDevices();
  }, [user]);

  const deleteDevice = async (id) => {
    try {
      // Delete the device from the devices database/collection
      setLoading(true);
      await deleteDoc(doc(devicesRef, id));
      

      // Find and delete the corresponding preference from the preferences collection
      const preferencesQuery = query(preferencesRef, where('device_id', '==', id));
      const preferencesSnapshot = await getDocs(preferencesQuery);
      if (!preferencesSnapshot.empty) {
          for (const doc of preferencesSnapshot.docs) {
              await deleteDoc(doc.ref);
          }
      }
      setLoading(false);
      
      // Update devices view to remove the device
      setDevices(devices.filter(device => device.id !== id));
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to delete the device');
    }
  };

  if (loading) {
    return (
      <Background>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#525252" />
        </View>
      </Background>
    );
  }
  return (
    <Background>
      <View className="flex items-center mt-12 gap-11 h-1/5">
        <Text className="text-white text-s font-semibold">Data Dynamos & Co</Text>
        <View className="flex-1 justify-center">
          <Text style={{fontSize: hp(4)}} className="text-black font-bold">Devices</Text>
        </View>
      </View>
      <View className="flex-1 items-center w-full">
        {/* This is a if condition to check if devices collection is empty */}
        {devices.length === 0 ? (
          <Text style={{ fontSize: hp(2) }} className="text-neutral-700 font-bold mb-5">There are no devices</Text>
        ) : (
        <View className="flex-row flex-wrap justify-around">
          {/* Devices grid  */}
        {devices.map((device, index) => (
            <View key={device.id} className='flex items-center mb-2'>
              <Text className='text-black text-s my-2'>{device.name}</Text>
              <View style={{height: hp(15), width: wp(50)}} className='rounded-lg px-12 p-2 relative'>
                <Image
                  source={{uri: device.image}}
                  className='w-full h-full object-cover rounded-2xl border-4 border-white'
                />
              </View>
              {/* Delete button */}
              <View className="flex-row left-11">
                  <Pressable>
                    <MaterialIcons 
                    onPress={() => deleteDevice(device.id)} 
                    name="delete-forever" 
                    size={hp(3)} 
                    color="#D24F33"/>
                  </Pressable>
                </View>
            </View>
          ))}
        </View>
        )}
          <Pressable onPress={() => router.replace('addDevice')} style={{height: hp(7), width: wp(80)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
          <Text style={{fontSize: hp(2.2)}} className="text-white font-bold tracking-wider">Add Device</Text>
        </Pressable>
      </View>
    </Background>

  )
}