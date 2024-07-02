import { View, Text, Image, Switch, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import { devicesRef, preferencesRef } from '../../firebaseConfig';
import { doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Background from '../../components/Background';


export default function preferences() {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load devices and preferences 
    const fetchDevicesAndPreferences = async () => {
      if (user) {
        const q = query(devicesRef, where('user_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedDevices = [];
        const fetchedPreferences = {};

        for (const doc of querySnapshot.docs) {
          const deviceData = doc.data();
          const deviceId = doc.id;
          fetchedDevices.push({ id: deviceId, ...deviceData });

          const preferenceDoc = await getDocs(query(preferencesRef, where('device_id', '==', deviceId)));
          if (!preferenceDoc.empty) {
            const preferenceData = preferenceDoc.docs[0].data();
            fetchedPreferences[deviceId] = {
              day: preferenceData.day,
              night: preferenceData.night,
            };
            
          }
        }
        setDevices(fetchedDevices);
        setPreferences(fetchedPreferences);
      }
      setLoading(false);
    };

    fetchDevicesAndPreferences();
  }, [user]);

  const toggleSwitch = async (deviceId, type) => {
    const updatedPreferences = { ...preferences };
    updatedPreferences[deviceId][type] = !updatedPreferences[deviceId][type];
    setPreferences(updatedPreferences);
    console.log('Updated preferences:', updatedPreferences);

    // Find the preference document and update the specific field
    const preferenceQuery = query(preferencesRef, where('device_id', '==', deviceId));
    const preferenceSnapshot = await getDocs(preferenceQuery);
    if (!preferenceSnapshot.empty) {
      const preferenceDocRef = doc(preferencesRef, preferenceSnapshot.docs[0].id);
      await updateDoc(preferenceDocRef, { [type]: updatedPreferences[deviceId][type] });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Background>
      <View className="items-center mt-12 gap-11 h-1/5">
        <Text className="text-white text-s font-semibold">Data Dynamos & Co</Text>
        <View className="flex-1 justify-center">
          <Text style={{fontSize: hp(4)}} className="text-black font-bold">Preferences</Text>
        </View>
      </View>
      <View className="flex-row justify-around items-center w-full my-4">
        <Text style={{fontSize: hp(3)}} className="text-neutral-500 font-bold">Day</Text>
        <Text style={{fontSize: hp(3)}} className="text-neutral-500 font-bold">Night</Text>
      </View>
      <ScrollView>
      <View className="flex-1 items-center w-full">
        {devices.length === 0 ? (
        <Text style={{ fontSize: hp(2) }} className="text-neutral-700 font-bold mb-5">There are no devices</Text>
        ) : (
        <View className="flex-row flex-wrap justify-around">
          {devices.map((device) => ( 
            <React.Fragment key={device.id}>       
              <View className="flex items-center mb-2">
                <Text className="text-black text-s my-2">{device.name}</Text>
                <View style={{ height: hp(15), width: wp(50) }} className="rounded-lg px-12 p-2 relative">
                  <Image
                      source={{ uri: device.image  }}
                      className="w-full h-full object-cover rounded-2xl border-4 border-white"
                    />
                  {/* Toggle Button */}
                  <Switch
                    style={{ 
                      position: 'absolute',
                      bottom: 10,
                      right: 40,
                      transform: [{ scaleX: .6 }, { scaleY: .6 }] 
                    }}
                    trackColor={{false: '#767577', true: '#FFFFFF'}}
                    thumbColor={preferences[device.id]?.day ? '#222222' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(device.id, 'day')}
                    value={preferences[device.id]?.day}
                  />
                </View>
              </View>                
              <View className="flex items-center mb-2">
                <Text className="text-black text-s my-2">{device.name}</Text>
                <View style={{ height: hp(15), width: wp(50) }} className="rounded-lg px-12 p-2 relative">
                  <Image
                      source={{ uri: device.image  }}
                      className="w-full h-full object-cover rounded-2xl border-4 border-white"
                    />
                  <Switch
                    style={{ 
                      position: 'absolute',
                      bottom: 10,
                      right: 40,
                      transform: [{ scaleX: .6 }, { scaleY: .6 }] 
                    }}
                    trackColor={{false: '#767577', true: '#FFFFFF'}}
                    thumbColor={preferences[device.id]?.night ? '#222222' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch(device.id, 'night')}
                    value={preferences[device.id]?.night}
                  />
                </View>
              </View>
            </React.Fragment>    
          ))}
        </View>
        )}
      </View>
      </ScrollView>
    </Background>
  )
}